import os

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Cria o administrador inicial do sistema."

    def handle(self, *args, **options):

        username = os.environ.get("ADMIN_USERNAME")
        password = os.environ.get("ADMIN_PASSWORD")
        email = os.environ.get("ADMIN_EMAIL", "")

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    "ADMIN_USERNAME ou ADMIN_PASSWORD não configurados. "
                    "Nenhum administrador foi criado."
                )
            )
            return

        usuario, criado = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            }
        )

        if criado:
            usuario.set_password(password)
            usuario.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Administrador '{username}' criado com sucesso."
                )
            )

        else:
            alterado = False

            if not usuario.is_staff:
                usuario.is_staff = True
                alterado = True

            if not usuario.is_superuser:
                usuario.is_superuser = True
                alterado = True

            if not usuario.is_active:
                usuario.is_active = True
                alterado = True

            if alterado:
                usuario.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Administrador '{username}' já existe."
                )
            )

