from typing import override
from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.db.models.functions import Lower

from core.mixins import AvatarMixin, BannerMixin, CreatedAtMixin, TypeMixin
from core.validators import UsernameValidator
from user.models import Profile


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
    members = models.ManyToManyField(
        Profile,
        related_name="joined_communities",
    )
    moderators = models.ManyToManyField(
        Profile,
        related_name="moderated_communities",
    )

    @override
    def __str__(self) -> str:
        return f"q/{self.name}"

    class Meta:  # pyright: ignore[reportIncompatibleVariableOverride]
        ordering = ["-created_at"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_quiblet_name_case_insensitive")
        ]
