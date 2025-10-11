# pyright: reportImportCycles=false
# no worries, models are only imported for typing
from typing import cast, override
from django.db import models

from quiblet.querysets import QuibQuerySet


# inheriting methods from queryset
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
