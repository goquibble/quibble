from typing import Any, cast, override
from django.db import models
from django.db.models.deletion import SET_NULL
from django.utils.text import slugify
from django_resized.forms import ResizedImageField

from core.mixins import CreatedAtMixin, IdMixin
from quiblet.models import Quiblet
from user.models import Profile


class Quib(CreatedAtMixin, IdMixin):
    def cover_upload_path(self, _filename: str):
        return f"covers/q-{self.pk}.webp"

    def cover_small_upload_path(self, _filename: str):
        return f"covers/q-{self.pk}-small.webp"

    quiblet = models.ForeignKey(Quiblet, related_name="quibs", on_delete=models.CASCADE)
    poster = models.ForeignKey(
        Profile, related_name="quibs", on_delete=models.SET_NULL, null=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=50, editable=False, blank=True)
    content = models.TextField(null=True, blank=True)
    is_highlighted = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
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
        size=[100, 100],
        crop=["middle", "center"],
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
        old: Quib | None = None
        if self.pk:
            old = (
                Quib.objects.filter(pk=self.pk)
                .only("title", "cover", "cover_small")
                .first()
            )

        if not self.slug or (old and old.title != self.title):
            slug_base = slugify(cast(str, self.title)).replace("-", "_")
            self.slug = slug_base[:50]

        cover_changed = old is None or old.cover != self.cover
        if self.cover and (not self.cover_small or cover_changed):
            self.cover_small = self.cover.file

        super().save(*args, **kwargs)


class QuibVote(models.Model):
    quib = models.ForeignKey(Quib, related_name="votes", on_delete=models.CASCADE)
    voter = models.ForeignKey(
        Profile, related_name="quib_votes", on_delete=SET_NULL, null=True
    )
    # voting logic: +1 for upvote and -1 for downvote
    value = models.SmallIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["quib", "voter"], name="unique_quib_voter")
        ]
