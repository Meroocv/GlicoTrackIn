from django.contrib import admin
from .models import Paciente


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "nome_social",
        "cpf",
        "data_nascimento",
        "telefone",
        "ativo",
    )
    search_fields = (
        "nome",
        "nome_social",
        "cpf",
    )