from django.apps import AppConfig


class AiSearchConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ai_search"

    def ready(self):
        import ai_search.signals  # noqa: F401
