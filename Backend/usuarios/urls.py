from django.urls import path

from .views import (
    LoginView,
    UsuarioAtualView,
    LogoutView,
    CadastroUsuarioView,
    GestaoUsuariosView,
    GestaoUsuarioDetalheView,
    ResetarSenhaUsuarioView,
    TrocaSenhaInicialView,
)


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("usuario/", UsuarioAtualView.as_view(), name="usuario-atual"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("cadastro/", CadastroUsuarioView.as_view(), name="cadastro-usuario"),
    path("gestao/", GestaoUsuariosView.as_view(), name="gestao-usuarios"),
    path("gestao/<int:usuario_id>/", GestaoUsuarioDetalheView.as_view(), name="gestao-usuario-detalhe"),
    path("gestao/<int:usuario_id>/resetar-senha/", ResetarSenhaUsuarioView.as_view(), name="resetar-senha-usuario"),
    path("alterar-senha-inicial/", TrocaSenhaInicialView.as_view(), name="alterar-senha-inicial"),
]
