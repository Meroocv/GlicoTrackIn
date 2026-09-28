"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from acompanhamentos.views import HistoricoPacienteView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("pacientes.urls")),
    path("api/", include("acompanhamentos.urls")),
    path("api/pacientes/<int:paciente_id>/historico/", HistoricoPacienteView.as_view(), name="historico-paciente"),
    path("api/usuarios/", include("usuarios.urls")),
]
