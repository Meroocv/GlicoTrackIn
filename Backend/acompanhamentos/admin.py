from django.contrib import admin
from .models import AcompanhamentoEstado

from .models import (
    RegistroDiario,
    MedicaoGlicemica,
    AtividadeFisica,
    Alimentacao,
    Hidratacao,
    Sono,
    Sintoma,
    MedicamentoPaciente,
    RegistroMedicamento,
)

@admin.register(AcompanhamentoEstado)
class AcompanhamentoEstadoAdmin(admin.ModelAdmin):
    list_display = (
        "paciente",
        "registro",
        "etapa",
        "status",
        "atualizado_em",
    )

    list_filter = (
        "etapa",
        "status",
    )

    search_fields = (
        "paciente__nome",
        "paciente__cpf",
    )


admin.site.register(RegistroDiario)
admin.site.register(MedicaoGlicemica)
admin.site.register(AtividadeFisica)
admin.site.register(Alimentacao)
admin.site.register(Hidratacao)
admin.site.register(Sono)
admin.site.register(Sintoma)
admin.site.register(MedicamentoPaciente)
admin.site.register(RegistroMedicamento)