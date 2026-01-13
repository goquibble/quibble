# pyright: reportUnusedImport=false
from typing import override
from django.apps import AppConfig


class QuibletConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "quiblet"

    @override
    def ready(self) -> None:
        from . import signals  # noqa: F401
