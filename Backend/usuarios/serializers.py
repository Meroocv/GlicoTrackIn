from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
import re

from .models import PerfilUsuario


class UsuarioSerializer(serializers.ModelSerializer):

    nome_completo = serializers.SerializerMethodField()
    nivel_acesso = serializers.SerializerMethodField()
    deve_alterar_senha = serializers.SerializerMethodField()
    ativo = serializers.BooleanField(source="is_active", read_only=True)
    superusuario = serializers.BooleanField(source="is_superuser", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "nome_completo",
            "nivel_acesso",
            "deve_alterar_senha",
            "ativo",
            "superusuario",
        ]

    def get_nome_completo(self, obj):
        perfil = getattr(obj, "perfil", None)
        return (perfil.nome_completo if perfil else "") or f"{obj.first_name} {obj.last_name}".strip()

    def get_nivel_acesso(self, obj):
        if obj.is_superuser:
            return "administrador"
        perfil = getattr(obj, "perfil", None)
        return perfil.nivel_acesso if perfil else "profissional"

    def get_deve_alterar_senha(self, obj):
        perfil = getattr(obj, "perfil", None)
        return perfil.deve_alterar_senha if perfil else False


class CadastroUsuarioSerializer(serializers.ModelSerializer):
    cpf = serializers.CharField(write_only=True, min_length=11, max_length=14)
    nome_completo = serializers.CharField(max_length=150)
    nivel_acesso = serializers.ChoiceField(choices=("administrador", "profissional", "leitura"), default="profissional")

    class Meta:
        model = User
        fields = ("id", "cpf", "nome_completo", "nivel_acesso")

    def validate_cpf(self, value):
        digits = "".join(character for character in value if character.isdigit())
        if len(digits) != 11:
            raise serializers.ValidationError("Informe um CPF com 11 dígitos.")
        return digits

    def validate(self, attrs):
        partes = attrs["nome_completo"].strip().split()
        if len(partes) < 2:
            raise serializers.ValidationError({"nome_completo": "Informe nome e sobrenome."})
        username = re.sub(r"[^\w.-]", "", f"{partes[0]}.{partes[-1]}", flags=re.UNICODE).upper()
        if not username or username == ".":
            raise serializers.ValidationError({"nome_completo": "O nome não permite gerar um usuário válido."})
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"nome_completo": f"O usuário {username} já existe. Ajuste o nome para diferenciá-lo."})
        attrs["username"] = username
        attrs["first_name"] = partes[0].title()
        attrs["last_name"] = " ".join(partes[1:]).title()
        return attrs

    def create(self, validated_data):
        nome_completo = validated_data.pop("nome_completo")
        nivel_acesso = validated_data.pop("nivel_acesso", "profissional")
        cpf = validated_data.pop("cpf")
        user = User(**validated_data)
        user.set_password(cpf)
        user.save()
        from .models import PerfilUsuario
        PerfilUsuario.objects.update_or_create(
            user=user,
            defaults={"nome_completo": nome_completo, "nivel_acesso": nivel_acesso, "deve_alterar_senha": True},
        )
        return user


class TrocaSenhaInicialSerializer(serializers.Serializer):
    nova_senha = serializers.CharField(write_only=True, trim_whitespace=False)
    confirmar_senha = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if attrs["nova_senha"] != attrs["confirmar_senha"]:
            raise serializers.ValidationError({"confirmar_senha": "As senhas não coincidem."})
        validate_password(attrs["nova_senha"], self.context["request"].user)
        return attrs


class EditarUsuarioSerializer(serializers.Serializer):
    nome_completo = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False, allow_blank=True)
    nivel_acesso = serializers.ChoiceField(choices=("administrador", "profissional", "leitura"), required=False)
    ativo = serializers.BooleanField(required=False)

    def validate_nome_completo(self, value):
        partes = value.strip().split()
        if len(partes) < 2:
            raise serializers.ValidationError("Informe nome e sobrenome.")
        username = re.sub(r"[^\w.-]", "", f"{partes[0]}.{partes[-1]}", flags=re.UNICODE).upper()
        conflito = User.objects.filter(username__iexact=username).exclude(pk=self.instance.pk).exists()
        if not username or username == "." or conflito:
            raise serializers.ValidationError("Não foi possível gerar um usuário único a partir deste nome.")
        self.username_gerado = username
        self.nome_partes = partes
        return value.strip()

    def update(self, instance, validated_data):
        perfil, _ = PerfilUsuario.objects.get_or_create(user=instance)
        nome = validated_data.pop("nome_completo", None)
        if nome is not None:
            partes = self.nome_partes
            instance.username = self.username_gerado
            instance.first_name = partes[0].title()
            instance.last_name = " ".join(partes[1:]).title()
            perfil.nome_completo = nome
        for field in ("email", "ativo"):
            if field in validated_data:
                setattr(instance, "is_active" if field == "ativo" else field, validated_data[field])
        if "nivel_acesso" in validated_data:
            if instance.is_superuser and validated_data["nivel_acesso"] != "administrador":
                raise serializers.ValidationError({"nivel_acesso": "A conta superadministradora deve manter o nível administrador."})
            perfil.nivel_acesso = validated_data["nivel_acesso"]
        instance.save()
        perfil.save()
        return instance


class ResetarSenhaSerializer(serializers.Serializer):
    cpf = serializers.CharField(write_only=True, min_length=11, max_length=14)

    def validate_cpf(self, value):
        digits = "".join(character for character in value if character.isdigit())
        if len(digits) != 11:
            raise serializers.ValidationError("Informe um CPF com 11 dígitos.")
        return digits
