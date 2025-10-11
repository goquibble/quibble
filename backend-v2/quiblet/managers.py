# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import cast, override
from django.db import models

from quiblet.querysets import QuibQuerySet


class QuibManager(models.Manager.from_queryset(QuibQuerySet)):
    @override
    def get_queryset(self) -> QuibQuerySet:
        return cast(QuibQuerySet, super().get_queryset()).with_votes()
