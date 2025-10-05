# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import TYPE_CHECKING
from django.db import models
from django.db.models import Count, Q

if TYPE_CHECKING:
    from quiblet.models import Quib


class QuibQuerySet(models.QuerySet["Quib"]):
    """Custom QuerySet for Quib model providing annotated values."""

    def with_votes(self) -> models.QuerySet["Quib"]:
        return self.annotate(
            upvotes=Count("votes", filter=Q(votes__value=1)),
            downvotes=Count("votes", filter=Q(votes__value=-1)),
        )
