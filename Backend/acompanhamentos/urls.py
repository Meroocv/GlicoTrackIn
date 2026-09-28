from rest_framework.routers import DefaultRouter

from .views import (
    RegistroDiarioViewSet,
    MedicaoGlicemicaViewSet,
    AtividadeFisicaViewSet,
    AlimentacaoViewSet,
    HidratacaoViewSet,
    SonoViewSet,
    SintomaViewSet,
    RegistroMedicamentoViewSet
)


router = DefaultRouter()

router.register(
    "registros",
    RegistroDiarioViewSet,
    basename="registro"
)

router.register(
    "glicemias",
    MedicaoGlicemicaViewSet,
    basename="glicemia"
)

router.register(
    "atividades",
    AtividadeFisicaViewSet,
    basename="atividade"
)

router.register(
    "alimentacoes",
    AlimentacaoViewSet,
    basename="alimentacao"
)

router.register(
    "hidratacoes",
    HidratacaoViewSet,
    basename="hidratacao"
)

router.register(
    "sonos",
    SonoViewSet,
    basename="sono"
)

router.register(
    "sintomas",
    SintomaViewSet,
    basename="sintoma"
)

router.register(
    "registros-medicamentos",
    RegistroMedicamentoViewSet,
    basename="registro-medicamento"
)

urlpatterns = router.urls