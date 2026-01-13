from django.db import models
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField


class ShortUUIDMixin(models.Model):
    """Adds an `id` field as primary key and a shortuuid generated one."""

    id = ShortUUIDField(  # pyright: ignore
        _("Id"),
        editable=False,
        length=7,
        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
        primary_key=True,
    )

    class Meta:
        abstract = True
