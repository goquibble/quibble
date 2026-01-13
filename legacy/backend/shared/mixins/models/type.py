from django.db import models
from django.utils.translation import gettext_lazy as _


class TypeMixin(models.Model):
    """Adds `type` field with `PUBLIC/RESTRICTED/PRIVATE` choices"""

    class Type(models.TextChoices):
        PUBLIC = "PUBLIC", _("Public")
        RESTRICTED = "RESTRICTED", _("Restricted")
        PRIVATE = "PRIVATE", _("Private")

    type = models.CharField(_("Type"), choices=Type.choices, default=Type.PUBLIC)

    class Meta:
        abstract = True
