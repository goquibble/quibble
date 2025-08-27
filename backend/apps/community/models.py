from apps.user.models import Profile
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from django.utils.translation import gettext_lazy as _
from dynamic_filenames import FilePattern
from shared.mixins.models.avatar import AvatarMixin
from shared.mixins.models.created_at import CreatedAtMixin
from shared.mixins.models.type import TypeMixin
from shared.validators.unique_name import UniqueNameValidator


class Topic(models.Model):
    class Sensitivity(models.TextChoices):
        SENSITIVE = "SENSITIVE", _("Sensitive")
        NON_SENSITIVE = "NON_SENSITIVE", _("Non-Sensitive")

    display_name = models.CharField(_("Display name"), max_length=255)
    icon = models.CharField(_("Icon"), max_length=10)
    sensitivity = models.CharField(
        _("Sensitivity"),
        max_length=25,
        choices=Sensitivity.choices,
        default=Sensitivity.NON_SENSITIVE,
    )
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name="children", on_delete=models.CASCADE
    )

    class Meta:
        ordering = ("display_name",)

    def __str__(self) -> str:
        return f"{self.display_name} {self.icon}"


class Community(AvatarMixin, CreatedAtMixin, TypeMixin):
    name_validator = UniqueNameValidator()

    name = models.CharField(
        _("Name"),
        unique=True,
        max_length=25,
        validators=[name_validator],
        help_text=_("Required. 25 characters or fewer. Letters, digits and ./_ only."),
        error_messages={"unique": _("Community with this name already exists.")},
    )
    description = models.TextField(_("Description"))
    title = models.CharField(_("Title"), max_length=50, null=True, blank=True)
    banner = models.ImageField(
        _("Banner"),
        upload_to=FilePattern(filename_pattern="community_banner/{uuid:s}{ext}"),
        blank=True,
        null=True,
    )
    nsfw = models.BooleanField(_("Nsfw"), default=False)
    topics = models.ManyToManyField(Topic, verbose_name=_("Topics"))
    members = models.ManyToManyField(
        Profile,
        related_name="joined_communities",
        blank=True,
        verbose_name=_("Members"),
    )
    moderators = models.ManyToManyField(
        Profile,
        related_name="moderated_communities",
        blank=True,
        verbose_name=_("Moderators"),
    )

    class Meta:  # pyright: ignore
        verbose_name = _("Community")
        verbose_name_plural = _("Communities")
        ordering = ["-created_at"]
        constraints = [
            UniqueConstraint(
                Lower("name"), name="unique_community_name_case_insensitive"
            )
        ]

    def __str__(self) -> str:
        return f"q/{self.name}"

    def save(self, *args, **kwargs):
        # if action is to update existing one
        if self.pk:
            current_topics_count = self.topics.count()
            if current_topics_count > 3:
                raise ValidationError("A community can only have upto 3 topics.")

        super().save(*args, **kwargs)
