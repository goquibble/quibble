from typing import Any, cast, override
from django.db import models
from django.utils.text import slugify
from django_resized.forms import ResizedImageField

from core.mixins import CreatedAtMixin, IdMixin
from quiblet.models import Quiblet
from user.models import Profile


class Quib(CreatedAtMixin, IdMixin):
    def cover_upload_path(self, _filename: str):
        return f"covers/{self.slug}.webp"

    def cover_small_upload_path(self, _filename: str):
        return f"covers/{self.slug}-small.webp"

    quiblet = models.ForeignKey(Quiblet, related_name="quibs", on_delete=models.CASCADE)
    poster = models.ForeignKey(
        Profile, related_name="quibs", on_delete=models.SET_NULL, null=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=50, editable=False, blank=True)
    content = models.TextField(null=True, blank=True)
    is_highlighted = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    cover = ResizedImageField(
        upload_to=cover_upload_path,
        quality=75,
        force_format="WEBP",
        null=True,
        blank=True,
    )
    cover_small = ResizedImageField(
        upload_to=cover_small_upload_path,
        quality=1,
        force_format="WEBP",
        null=True,
        blank=True,
    )

    class Meta:  # pyright: ignore[reportIncompatibleVariableOverride]
        ordering = ["-created_at"]

    @override
    def __str__(self) -> str:
        return f"{self.pk}/{self.slug}"

    @override
    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.slug:
            self.slug = slugify(cast(str, self.title)[:50]).replace("-", "_")

        if self.cover and (not self.cover_small or self._has_cover_changed()):
            self.cover_small = self.cover

        return super().save(*args, **kwargs)

    def _has_cover_changed(self) -> bool:
        if not self.pk:
            return True

        old = Quib.objects.filter(pk=self.pk).first()
        if not old:
            return True
        return old.cover != self.cover
