from django.contrib import admin
from .models import PerfilUsuario

@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ("user", "nome_completo", "nivel_acesso")
    list_filter = ("nivel_acesso",)
    search_fields = ("user__username", "nome_completo")
