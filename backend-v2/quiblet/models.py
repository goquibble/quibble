# pyright: reportIncompatibleVariableOverride=false
from typing import Any, cast, override
from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.db.models.functions import Lower
from django.utils.text import slugify
from django_resized.forms import ResizedImageField
from django_shortuuid.fields import ShortUUIDField

from core.mixins import AvatarMixin, BannerMixin, CreatedAtMixin, TypeMixin
from core.validators import UsernameValidator
from user.models import Profile

# --------------------
# Quiblet Models
# --------------------


class Quiblet(CreatedAtMixin, AvatarMixin, BannerMixin, TypeMixin):
    name = models.CharField(
        unique=True,
        max_length=25,
        validators=[UsernameValidator()],
        error_messages={"unique": "Quiblet with this name already exists."},
    )
    description = models.TextField()
    title = models.CharField(max_length=50, null=True, blank=True)
    nsfw = models.BooleanField(default=False)
    members = models.ManyToManyField(Profile, related_name="joined_quiblets")
    moderators = models.ManyToManyField(Profile, related_name="moderated_quiblets")

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_quiblet_name_case_insensitive")
        ]

    @override
    def __str__(self) -> str:
        return f"q/{self.name}"


# --------------------
# Quib Models
# --------------------


class Quib(CreatedAtMixin):
    def cover_upload_path(self, filename: str):
        ext = filename.split(".")[-1]
        return f"covers/q-{self.pk}.{ext}"

    def cover_small_upload_path(self, filename: str):
        ext = filename.split(".")[-1]
        return f"covers/q-{self.pk}-small.{ext}"

    id = ShortUUIDField(
        length=7,
        primary_key=True,
        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
        collision_check=False,  # no need, because we're using both id and slug for query
    )
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
        editable=False,
    )

    class Meta:
        ordering = ["-created_at"]

    @override
    def __str__(self) -> str:
        return f"{self.pk}/{self.slug}"

    def _ensure_id(self):
        if self.pk:
            return
        # set ID before save for file files
        id_field = cast(ShortUUIDField, self._meta.get_field("id"))
        self.pk = id_field.generate_unique_shortuuid(self)

    @override
    def save(self, *args: Any, **kwargs: Any) -> None:
        self._ensure_id()
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
        Profile, related_name="quib_votes", on_delete=models.SET_NULL, null=True
    )
    # voting logic: +1 for upvote and -1 for downvote
    value = models.SmallIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["quib", "voter"], name="unique_quib_voter")
        ]
