from django.db import models
from django.utils.translation import gettext_lazy as _


class CreatedAtMixin(models.Model):
    """Adds `created_at` auto added date field."""

    created_at = models.DateTimeField(_("Create at"), auto_now_add=True)

    class Meta:
        abstract = True
