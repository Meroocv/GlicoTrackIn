from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from usuarios.views import PodeEditarDados

from pacientes.models import Paciente

from .models import (
    RegistroDiario,
    MedicaoGlicemica,
    AtividadeFisica,
    Alimentacao,
    Hidratacao,
    Sono,
    Sintoma,
    RegistroMedicamento,
)

from .serializers import (
    RegistroDiarioSerializer,
    MedicaoGlicemicaSerializer,
    AtividadeFisicaSerializer,
    AlimentacaoSerializer,
    HidratacaoSerializer,
    SonoSerializer,
    SintomaSerializer,
    RegistroMedicamentoSerializer,
    HistoricoDiarioSerializer
)


class RegistroDiarioViewSet(viewsets.ModelViewSet):
    queryset = RegistroDiario.objects.all()
    serializer_class = RegistroDiarioSerializer
    permission_classes = [PodeEditarDados]


class MedicaoGlicemicaViewSet(viewsets.ModelViewSet):
    queryset = MedicaoGlicemica.objects.all()
    serializer_class = MedicaoGlicemicaSerializer
    permission_classes = [PodeEditarDados]

class AtividadeFisicaViewSet(viewsets.ModelViewSet):
    queryset = AtividadeFisica.objects.all()
    serializer_class = AtividadeFisicaSerializer
    permission_classes = [PodeEditarDados]

class AlimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Alimentacao.objects.all()
    serializer_class = AlimentacaoSerializer
    permission_classes = [PodeEditarDados]

class HidratacaoViewSet(viewsets.ModelViewSet):
    queryset = Hidratacao.objects.all()
    serializer_class = HidratacaoSerializer
    permission_classes = [PodeEditarDados]

class SonoViewSet(viewsets.ModelViewSet):
    queryset = Sono.objects.all()
    serializer_class = SonoSerializer
    permission_classes = [PodeEditarDados]

class SintomaViewSet(viewsets.ModelViewSet):
    queryset = Sintoma.objects.all()
    serializer_class = SintomaSerializer
    permission_classes = [PodeEditarDados]

class RegistroMedicamentoViewSet(viewsets.ModelViewSet):
    queryset = RegistroMedicamento.objects.all()
    serializer_class = RegistroMedicamentoSerializer
    permission_classes = [PodeEditarDados]


class HistoricoPacienteView(APIView):
    permission_classes = [PodeEditarDados]

    def get(self, request, paciente_id):

        try:
            paciente = Paciente.objects.get(id=paciente_id)

        except Paciente.DoesNotExist:
            return Response(
                {"erro": "Paciente não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data_inicio = request.query_params.get("data_inicio")
        data_fim = request.query_params.get("data_fim")

        registros = RegistroDiario.objects.filter(
            paciente=paciente
            ).select_related(
                "paciente",
                "alimentacao",
                "hidratacao",
                "sono"
            ).prefetch_related(
                "glicemias",
                "atividades",
                "sintomas",
                "medicamentos"
            ).order_by("-data")

        if data_inicio:
            registros = registros.filter(
                data__gte=data_inicio
            )

        if data_fim:
            registros = registros.filter(
                data__lte=data_fim
            )

        serializer = HistoricoDiarioSerializer(
            registros,
            many=True
        )

        return Response({
            "paciente": {
                "id": paciente.id,
                "nome": paciente.nome,
                "nome_social": paciente.nome_social,
                "cpf": paciente.cpf,
            },
            "registros": serializer.data
        })
