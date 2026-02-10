from django.db import models
from django_resized.forms import ResizedImageField

from core.utils import get_avatar_upload_path, get_banner_upload_path


class CreatedAtMixin(models.Model):
    """Adds `created_at` field which auto saves current timezone."""

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class AvatarMixin(models.Model):
    """
    Adds `avatar` field which auto resizes and saves in WEBP format.
    Reduces quality to 75% and resizes to 300x300 ratio.
    """

    avatar_url = ResizedImageField(
        upload_to=get_avatar_upload_path,
        size=[300, 300],
        crop=["middle", "center"],
        quality=75,
        force_format="WEBP",
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True


class BannerMixin(models.Model):
    """
    Adds `banner` field which auto resizes and saves in WEBP format.
    Reduces quality to 75% and resizes to 1200x300 ratio.
    """

    banner = ResizedImageField(
        upload_to=get_banner_upload_path,
        size=[1200, 300],
        crop=["middle", "center"],
        quality=75,
        force_format="WEBP",
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True


class TypeMixin(models.Model):
    """
    Adds `type` field with `PUBLIC/RESTRICTED/PRIVATE` choices.
    Default type is `PUBLIC`.
    """

    class Type(models.TextChoices):
        PUBLIC = "PUBLIC", "Public"
        RESTRICTED = "RESTRICTED", "Restricted"
        PRIVATE = "PRIVATE", "Private"

    type = models.CharField(choices=Type.choices, default=Type.PUBLIC)

    class Meta:
        abstract = True
