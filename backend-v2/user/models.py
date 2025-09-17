from typing import TYPE_CHECKING, override
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.mixins import AvatarMixin, CreatedAtMixin
from core.validators import UsernameValidator
from user.managers import CustomUserManager


# pyright: reportUninitializedInstanceVariable=false
class CustomUser(AbstractBaseUser, PermissionsMixin):
    if TYPE_CHECKING:
        profiles: models.Manager["Profile"]

    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(
        "staff status",
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )
    is_active = models.BooleanField(
        "active",
        default=True,
        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        ordering = ["-date_joined"]


class Profile(CreatedAtMixin, AvatarMixin):
    user = models.ForeignKey(
        CustomUser, related_name="profiles", on_delete=models.CASCADE
    )
    username = models.CharField(
        unique=True,
        max_length=25,
        validators=[UsernameValidator()],
        error_messages={"unique": "Username already taken! Please try another one."},
    )
    name = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    @override
    def __str__(self) -> str:
        return f"u/{self.username}"

    class Meta:  # pyright: ignore[reportIncompatibleVariableOverride]
        ordering = ["-created_at"]
