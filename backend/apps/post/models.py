from apps.community.models import Community
from apps.user.models import Profile
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from dynamic_filenames import FilePattern
from shared.mixins.models.created_at import CreatedAtMixin
from shared.mixins.models.shortuuid import ShortUUIDMixin
from shared.mixins.models.type import TypeMixin

from .managers import PostManager


class Post(CreatedAtMixin, TypeMixin, ShortUUIDMixin):
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name="posts",
        verbose_name=_("Community"),
    )
    poster = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="posts",
        verbose_name=_("Poster"),
    )
    highlighted = models.BooleanField(_("Highlighted"), default=False)
    title = models.CharField(_("Title"), max_length=255)
    slug = models.SlugField(_("Slug"), max_length=25, blank=True)
    content = models.TextField(_("Content"), blank=True)
    cover = models.ImageField(
        _("Cover"),
        upload_to=FilePattern(filename_pattern="cover/{uuid:s}{ext}"),
        blank=True,
        null=True,
    )
    upvotes = models.ManyToManyField(
        Profile, related_name="upvoted_posts", blank=True, verbose_name=_("Upvotes")
    )
    downvotes = models.ManyToManyField(
        Profile, related_name="downvoted_posts", blank=True, verbose_name=_("Downvotes")
    )

    objects = PostManager()

    def save(self, *args, **kwargs):
        """Override save method to slugify title."""
        if not self.slug:
            self.slug = slugify(self.title[:25])

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.pk}/{self.slug}"

    class Meta:  # pyright: ignore
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")
        ordering = ["-created_at"]
