from typing import TYPE_CHECKING
from django.db import models
from django.db.models import Prefetch
from django.http import HttpRequest
from django_ltree.querysets import TreeQuerySet

from quiblet.mixins import BaseQuerySetMixin

if TYPE_CHECKING:
    from quiblet.models import Quib  # noqa: F401


class QuibQuerySet(models.QuerySet["Quib"], BaseQuerySetMixin):
    def published(self):
        """Return only published quibs."""
        return self.filter(is_published=True)

    def highlighted(self):
        """Return only highlighted (published) quibs."""
        return self.filter(is_highlighted=True)

    def for_quiblet(self, name: str):
        """Return quibs related to a specific quiblet."""
        return self.filter(quiblet__name=name)

    def for_request(self, request: HttpRequest):
        """Return comments based on request context."""
        qs = self
        profile_id = request.COOKIES.get("profile_id")

        if request.user and request.user.is_authenticated and profile_id:
            from user.models import Profile
            from quiblet.models import QuibVote

            voter = Profile.objects.get(id=profile_id, user=request.user)
            qs = qs.prefetch_related(
                Prefetch(
                    "votes",
                    queryset=QuibVote.objects.filter(voter=voter),
                    to_attr="user_vote",
                )
            )
        return qs


class CommentQuerySet(TreeQuerySet, BaseQuerySetMixin):
    def for_request(self, request: HttpRequest):
        """Return comments based on request context."""
        qs = self
        profile_id = request.COOKIES.get("profile_id")

        if request.user and request.user.is_authenticated and profile_id:
            from user.models import Profile
            from quiblet.models import CommentVote

            voter = Profile.objects.get(id=profile_id, user=request.user)
            qs = qs.prefetch_related(
                Prefetch(
                    "votes",
                    queryset=CommentVote.objects.filter(voter=voter),
                    to_attr="user_vote",
                )
            )
        return qs
