from django.db import models
from django_resized.forms import ResizedImageField

from core.utils import get_avatar_upload_path


class CreatedAtMixin(models.Model):
    """Adds `created_at` field which auto saves current timezone."""

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class AvatarMixin(models.Model):
    """Adds `avatar` field which auto resizes and saves in WEBP format."""

    avatar = ResizedImageField(
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
