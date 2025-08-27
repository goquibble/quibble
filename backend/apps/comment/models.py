from django.contrib.postgres import indexes as idx
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_ltree.models import TreeModel

from apps.post.models import Post
from apps.user.models import Profile
from shared.mixins.models.created_at import CreatedAtMixin

from .managers import CommentManager


class Comment(CreatedAtMixin, TreeModel):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name=_("Post"),
    )
    commenter = models.ForeignKey(
        Profile,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_("Commenter"),
        related_name="comments",
    )
    content = models.TextField(_("content"))
    upvotes = models.ManyToManyField(
        Profile, blank=True, verbose_name=_("Upvotes"), related_name="upvoted_comments"
    )
    downvotes = models.ManyToManyField(
        Profile,
        blank=True,
        verbose_name=_("Downvotes"),
        related_name="downvoted_comments",
    )
    # flag
    deleted = models.BooleanField(default=False)
    # custom manager for soft-deletions handling
    objects = CommentManager()

    @property
    def children_count(self):
        return self.children().count()

    def __str__(self) -> str:
        return f"Comment by {self.commenter}"

    class Meta:  # pyright: ignore
        indexes = [idx.GistIndex(fields=["path"])]
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")
