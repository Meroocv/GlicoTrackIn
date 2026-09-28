from django.db import models
from pacientes.models import Paciente


class RegistroDiario(models.Model):
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name="registros_diarios"
    )
    data = models.DateField()
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["paciente", "data"],
                name="registro_diario_paciente_data_unico"
            )
        ]

    def __str__(self):
        return f"{self.paciente.nome} - {self.data}"


class MedicaoGlicemica(models.Model):

    class MomentoGlicemia(models.TextChoices):
        JEJUM = "JEJUM", "Jejum"
        ANTES_REFEICAO = "ANTES_REFEICAO", "Antes da refeição"
        APOS_REFEICAO = "APOS_REFEICAO", "Após a refeição"
        ANTES_DORMIR = "ANTES_DORMIR", "Antes de dormir"
        OUTRO = "OUTRO", "Outro"

    registro = models.ForeignKey(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="glicemias"
    )
    valor = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )
    horario = models.TimeField()
    momento = models.CharField(
        max_length=20,
        choices=MomentoGlicemia.choices
    )
    observacao = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.valor} mg/dL - {self.horario}"


class AtividadeFisica(models.Model):

    class TipoAtividade(models.TextChoices):
        CAMINHADA = "CAMINHADA", "Caminhada"
        CORRIDA = "CORRIDA", "Corrida"
        CICLISMO = "CICLISMO", "Ciclismo"
        MUSCULACAO = "MUSCULACAO", "Musculação"
        NATACAO = "NATACAO", "Natação"
        ESPORTE = "ESPORTE", "Esporte"
        DANCA = "DANCA", "Dança"
        ALONGAMENTO = "ALONGAMENTO", "Alongamento"
        OUTRA = "OUTRA", "Outra"

    registro = models.ForeignKey(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="atividades"
    )

    realizou = models.BooleanField()

    tipo = models.CharField(
        max_length=20,
        choices=TipoAtividade.choices,
        blank=True
    )

    duracao_minutos = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    observacao = models.TextField(blank=True)

    def __str__(self):
        return self.tipo or "Atividade física"

class Alimentacao(models.Model):
    registro = models.OneToOneField(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="alimentacao"
    )

    descricao = models.TextField()

    def __str__(self):
        return f"Alimentação - {self.registro.data}"


class Hidratacao(models.Model):
    registro = models.OneToOneField(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="hidratacao"
    )

    lembrou_de_se_hidratar = models.BooleanField()

    def __str__(self):
        return "Lembrou de se hidratar" if self.lembrou_de_se_hidratar else "Não lembrou de se hidratar"


class Sono(models.Model):
    registro = models.OneToOneField(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="sono"
    )

    descricao = models.TextField()

    def __str__(self):
        return f"Sono - {self.registro.data}"


class Sintoma(models.Model):
    registro = models.ForeignKey(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="sintomas"
    )
    descricao = models.CharField(max_length=255)
    intensidade = models.CharField(
        max_length=30,
        blank=True
    )
    observacao = models.TextField(blank=True)

    def __str__(self):
        return self.descricao


class MedicamentoPaciente(models.Model):
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name="medicamentos"
    )
    nome = models.CharField(max_length=150)
    dose = models.CharField(max_length=100)
    frequencia = models.CharField(max_length=100)
    horario = models.TimeField(
        null=True,
        blank=True
    )
    observacao = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} - {self.dose}"


class RegistroMedicamento(models.Model):

    class StatusUso(models.TextChoices):
        TOMOU = "TOMOU", "Tomou"
        NAO_TOMOU = "NAO_TOMOU", "Não tomou"
        ESQUECEU = "ESQUECEU", "Esqueceu"
        OUTRO = "OUTRO", "Outro"

    registro = models.ForeignKey(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="medicamentos"
    )
    medicamento = models.ForeignKey(
        MedicamentoPaciente,
        on_delete=models.CASCADE,
        related_name="registros_uso"
    )
    horario = models.TimeField(
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=StatusUso.choices
    )
    observacao = models.TextField(blank=True)

    def __str__(self):
        return f"{self.medicamento.nome} - {self.status}"

class AcompanhamentoEstado(models.Model):

    class Etapa(models.TextChoices):
        GLICEMIA_JEJUM = "GLICEMIA_JEJUM", "Glicemia em jejum"
        ATIVIDADE = "ATIVIDADE", "Atividade física"
        ALIMENTACAO = "ALIMENTACAO", "Alimentação"
        HIDRATACAO = "HIDRATACAO", "Hidratação"
        SONO = "SONO", "Sono"
        SINTOMAS = "SINTOMAS", "Sintomas"
        MEDICAMENTOS = "MEDICAMENTOS", "Medicamentos"
        FINALIZADO = "FINALIZADO", "Finalizado"

    class Status(models.TextChoices):
        EM_ANDAMENTO = "EM_ANDAMENTO", "Em andamento"
        FINALIZADO = "FINALIZADO", "Finalizado"

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name="acompanhamentos_estado"
    )

    registro = models.OneToOneField(
        RegistroDiario,
        on_delete=models.CASCADE,
        related_name="estado"
    )

    etapa = models.CharField(
        max_length=30,
        choices=Etapa.choices
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.EM_ANDAMENTO
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.paciente.nome} - {self.registro.data} - {self.etapa}"
