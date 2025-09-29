# pyright: reportUnusedImport=false
from typing import override
from django.apps import AppConfig


class QuibConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "quib"

    @override
    def ready(self) -> None:
        from . import signals  # noqa: F401
