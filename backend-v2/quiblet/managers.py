# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import override, TYPE_CHECKING
from django.db import models

from quiblet.querysets import QuibQuerySet

if TYPE_CHECKING:
    from quiblet.models import Quib


class QuibManager(models.Manager["Quib"]):
    @override
    def get_queryset(self) -> models.QuerySet["Quib"]:
        return QuibQuerySet(self.model, using=self._db).with_votes()
