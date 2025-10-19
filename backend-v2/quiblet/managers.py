# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import TYPE_CHECKING, override
from django.db import models
from django.http import HttpRequest
from django_ltree.managers import TreeManager

from quiblet.querysets import CommentQuerySet, QuibQuerySet

if TYPE_CHECKING:
    from quiblet.models import Comment, Quib


class QuibManager(models.Manager.from_queryset(QuibQuerySet)):
    model: type["Quib"]

    @override
    def get_queryset(self) -> QuibQuerySet:
        return QuibQuerySet(self.model, using=self._db).with_votes()

    # NOTE: promote only top methods for typing
    def published(self):
        return self.get_queryset().published()

    def for_quiblet(self, name: str):
        return self.get_queryset().for_quiblet(name)


class CommentManager(TreeManager.from_queryset(CommentQuerySet)):
    model: type["Comment"]

    @override
    def get_queryset(self) -> CommentQuerySet:
        return CommentQuerySet(self.model, using=self._db).with_votes()

    # NOTE: promote only top methods for typing
    def for_request(self, request: HttpRequest):
        return self.get_queryset().for_request(request)
