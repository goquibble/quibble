from django.db import models
from django.utils.translation import gettext_lazy as _
from dynamic_filenames import FilePattern


class AvatarMixin(models.Model):
    """Adds an `avatar` field with file upload pattern."""

    avatar = models.ImageField(
        _("Avatar"),
        upload_to=FilePattern(filename_pattern="avatar/{uuid:s}{ext}"),
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True
