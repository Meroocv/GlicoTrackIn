from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):
    class NivelAcesso(models.TextChoices):
        ADMINISTRADOR = "administrador", "Administrador"
        PROFISSIONAL = "profissional", "Profissional"
        LEITURA = "leitura", "Somente leitura"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="perfil"
    )

    nome_completo = models.CharField(
        max_length=150,
        blank=True
    )

    nivel_acesso = models.CharField(
        max_length=20,
        choices=NivelAcesso.choices,
        default=NivelAcesso.PROFISSIONAL,
    )

    deve_alterar_senha = models.BooleanField(default=False)

    def __str__(self):
        return self.nome_completo or self.user.username
