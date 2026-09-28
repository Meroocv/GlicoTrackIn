from django.db import models


class Paciente(models.Model):

    nome = models.CharField(
        max_length=150
    )

    nome_social = models.CharField(
        max_length=150,
        blank=True
    )

    cpf = models.CharField(
        max_length=14,
        unique=True
    )

    data_nascimento = models.DateField()

    telefone = models.CharField(
        max_length=20
    )

    ativo = models.BooleanField(
        default=True
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.nome