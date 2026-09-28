from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import PerfilUsuario
from .serializers import (
    CadastroUsuarioSerializer,
    EditarUsuarioSerializer,
    ResetarSenhaSerializer,
    TrocaSenhaInicialSerializer,
    UsuarioSerializer,
)


class IsAdministrador(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(getattr(user, "perfil", None), "deve_alterar_senha", False):
            return False
        return user.is_superuser or (
            hasattr(user, "perfil") and user.perfil.nivel_acesso == "administrador"
        )


class PodeEditarDados(BasePermission):
    """Leitura permite consultar os dados; profissionais e admins podem alterá-los."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(getattr(request.user, "perfil", None), "deve_alterar_senha", False):
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user.is_superuser or not (
            hasattr(request.user, "perfil") and request.user.perfil.nivel_acesso == "leitura"
        )


class CadastroUsuarioView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request):
        serializer = CadastroUsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


class GestaoUsuariosView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]

    def get(self, request):
        usuarios = User.objects.select_related("perfil").order_by("first_name", "last_name", "id")
        return Response(UsuarioSerializer(usuarios, many=True).data)

    def post(self, request):
        serializer = CadastroUsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


class GestaoUsuarioDetalheView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]

    def patch(self, request, usuario_id):
        usuario = get_object_or_404(User, pk=usuario_id)
        if usuario.pk == request.user.pk and request.data.get("ativo") is False:
            return Response({"erro": "Você não pode desativar sua própria conta."}, status=status.HTTP_400_BAD_REQUEST)
        if usuario.pk == request.user.pk and request.data.get("nivel_acesso") in ("profissional", "leitura"):
            return Response({"erro": "Você não pode remover seu próprio acesso administrativo."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EditarUsuarioSerializer(usuario, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UsuarioSerializer(usuario).data)

    def delete(self, request, usuario_id):
        usuario = get_object_or_404(User, pk=usuario_id)
        if usuario.pk == request.user.pk:
            return Response({"erro": "Você não pode excluir sua própria conta."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResetarSenhaUsuarioView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]

    def post(self, request, usuario_id):
        usuario = get_object_or_404(User, pk=usuario_id)
        serializer = ResetarSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario.set_password(serializer.validated_data["cpf"])
        usuario.save(update_fields=["password"])
        perfil, _ = PerfilUsuario.objects.get_or_create(user=usuario)
        perfil.deve_alterar_senha = True
        perfil.save(update_fields=["deve_alterar_senha"])
        if hasattr(usuario, "auth_token"):
            usuario.auth_token.delete()
        return Response({"mensagem": "Senha redefinida. A senha temporária é o CPF informado."})


class TrocaSenhaInicialView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        perfil, _ = PerfilUsuario.objects.get_or_create(user=request.user)
        if not perfil.deve_alterar_senha:
            return Response({"erro": "A senha inicial já foi alterada."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = TrocaSenhaInicialSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["nova_senha"])
        request.user.save(update_fields=["password"])
        perfil.deve_alterar_senha = False
        perfil.save(update_fields=["deve_alterar_senha"])
        return Response({"mensagem": "Senha alterada com sucesso."})


class LoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {
                    "erro": "Informe usuário e senha."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = authenticate(
            username=username,
            password=password
        )

        if usuario is None:
            return Response(
                {
                    "erro": "Usuário ou senha inválidos."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not usuario.is_active:
            return Response(
                {
                    "erro": "Usuário está desativado."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        token, created = Token.objects.get_or_create(
            user=usuario
        )

        return Response(
            {
                "token": token.key,
                "usuario": UsuarioSerializer(usuario).data,
                "deve_alterar_senha": getattr(getattr(usuario, "perfil", None), "deve_alterar_senha", False),
            },
            status=status.HTTP_200_OK
        )


class UsuarioAtualView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            UsuarioSerializer(request.user).data
        )


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if hasattr(request.user, "auth_token"):
            request.user.auth_token.delete()

        return Response(
            {
                "mensagem": "Logout realizado com sucesso."
            },
            status=status.HTTP_200_OK
        )
