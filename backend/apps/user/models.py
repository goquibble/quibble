from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from dynamic_filenames import FilePattern

from shared.mixins.models.avatar import AvatarMixin
from shared.mixins.models.created_at import CreatedAtMixin
from shared.validators.unique_name import UniqueNameValidator

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email address"), unique=True)
    date_joined = models.DateTimeField(_("Date joined"), auto_now_add=True)
    is_staff = models.BooleanField(
        _("Staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("Active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. Unselect this instead of deleting accounts."
        ),
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:  # pyright: ignore
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-date_joined"]


class Profile(CreatedAtMixin, AvatarMixin):
    username_validator = UniqueNameValidator()

    user = models.ForeignKey(
        User, related_name="profiles", on_delete=models.CASCADE, verbose_name=_("User")
    )
    username = models.CharField(
        _("Username"),
        unique=True,
        max_length=25,
        validators=[username_validator],
        help_text=_("Required. 25 characters or fewer. Letters, digits and ./_ only."),
        error_messages={
            "unique": _("A profile with that username already exists."),
        },
    )
    name = models.CharField(_("Name"), max_length=255, blank=True, null=True)
    bio = models.TextField(_("Bio"), blank=True, null=True)
    banner = models.ImageField(
        _("Banner"),
        upload_to=FilePattern(filename_pattern="banner/{uuid:s}{ext}"),
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"u/{self.username}"

    class Meta:  # pyright: ignore
        verbose_name = _("Profile")
        verbose_name_plural = _("Profiles")
        ordering = ["-created_at"]
