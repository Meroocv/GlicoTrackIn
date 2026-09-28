from rest_framework import serializers

from .models import (
    RegistroDiario,
    MedicaoGlicemica,
    AtividadeFisica,
    Alimentacao,
    Hidratacao,
    Sono,
    Sintoma,
    RegistroMedicamento
)


class RegistroDiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroDiario
        fields = "__all__"


class MedicaoGlicemicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicaoGlicemica
        fields = "__all__"

class AtividadeFisicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadeFisica
        fields = "__all__"

class AlimentacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimentacao
        fields = "__all__"

class HidratacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hidratacao
        fields = "__all__"

class SonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sono
        fields = "__all__"

class SintomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sintoma
        fields = "__all__"

class RegistroMedicamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroMedicamento
        fields = "__all__"


class HistoricoDiarioSerializer(serializers.ModelSerializer):
    glicemias = MedicaoGlicemicaSerializer(many=True, read_only=True)
    atividades = AtividadeFisicaSerializer(many=True, read_only=True)
    alimentacao = AlimentacaoSerializer(read_only=True)
    hidratacao = HidratacaoSerializer(read_only=True)
    sono = SonoSerializer(read_only=True)
    sintomas = SintomaSerializer(many=True, read_only=True)
    medicamentos = RegistroMedicamentoSerializer(many=True, read_only=True)

    class Meta:
        model = RegistroDiario
        fields = [
            "id",
            "data",
            "observacoes",
            "glicemias",
            "atividades",
            "alimentacao",
            "hidratacao",
            "sono",
            "sintomas",
            "medicamentos",
        ]