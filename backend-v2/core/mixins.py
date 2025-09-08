from django.db import models


class CreatedAtMixin(models.Model):
    """Adds `created_at` field which auto saves current timezone."""

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
