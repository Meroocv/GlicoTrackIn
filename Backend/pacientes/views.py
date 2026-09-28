from rest_framework import viewsets
from .models import Paciente
from .serializers import PacienteSerializer
from usuarios.views import PodeEditarDados


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [PodeEditarDados]
    
