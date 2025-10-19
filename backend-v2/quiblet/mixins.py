from typing import Any
from django.db.models import Count, Q


class BaseQuerySetMixin:
    def with_votes(self: Any):
        return self.annotate(
            upvotes=Count("votes", filter=Q(votes__value=1)),
            downvotes=Count("votes", filter=Q(votes__value=-1)),
        )
