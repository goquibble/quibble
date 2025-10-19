from typing import TYPE_CHECKING
from django.db import models
from django.db.models import Prefetch
from django.http import HttpRequest

from quiblet.mixins import BaseQuerySetMixin

if TYPE_CHECKING:
    from quiblet.models import Comment, Quib  # noqa: F401

# --------------------
# Quiblet QuerySets
# --------------------


class QuibQuerySet(BaseQuerySetMixin, models.QuerySet["Quib"]):
    def published(self):
        return self.filter(is_published=True)

    def highlighted(self):
        return self.filter(is_highlighted=True)

    def for_quiblet(self, name: str):
        return self.filter(quiblet__name=name)

    def for_request(self, request: HttpRequest):
        qs = self
        if request.user and request.user.is_authenticated:
            from user.models import Profile
            from quiblet.models import QuibVote

            voter = Profile.objects.get(user=request.user)
            qs = qs.prefetch_related(
                Prefetch(
                    "votes",
                    queryset=QuibVote.objects.filter(voter=voter),
                    to_attr="user_vote",
                )
            )
        return qs


# --------------------
# Comment QuerySets
# --------------------


class CommentQuerySet(models.QuerySet["Comment"]):
    pass
