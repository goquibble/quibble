from typing import override
from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"

    @override
    def ready(self) -> None:
        import user.signals  # pyright: ignore[reportUnusedImport]
