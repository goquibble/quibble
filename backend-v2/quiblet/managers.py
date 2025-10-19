# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import TYPE_CHECKING, cast, override
from django.db import models
from django_ltree.managers import TreeManager

from quiblet.querysets import CommentQuerySet, QuibQuerySet

if TYPE_CHECKING:
    from quiblet.models import Comment


class QuibManager(models.Manager.from_queryset(QuibQuerySet)):
    @override
    def get_queryset(self) -> QuibQuerySet:
        return cast(QuibQuerySet, super().get_queryset()).with_votes()

    # NOTE
    # manually promote only required entry method
    # this helps for linters
    def published(self):
        return self.get_queryset().published()

    def for_quiblet(self, name: str):
        return self.get_queryset().for_quiblet(name)


class CommentManager(TreeManager.from_queryset(CommentQuerySet)):
    model: type["Comment"]

    @override
    def get_queryset(self) -> CommentQuerySet:
        return CommentQuerySet(self.model, using=self._db).with_votes()
