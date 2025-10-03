# pyright: reportUnusedParameter=false
import os
from typing import Any, cast
from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Quib


@receiver(post_delete, sender=Quib)
def delete_quib_cover_files(sender: Quib, instance: Quib, **kwargs: Any):
    cover_path = getattr(cast(Any, instance.cover), "path", None)
    if cover_path and isinstance(cover_path, str) and os.path.isfile(cover_path):
        os.remove(cover_path)

    cover_small_path = getattr(cast(Any, instance.cover_small), "path", None)
    if (
        cover_small_path
        and isinstance(cover_small_path, str)
        and os.path.isfile(cover_small_path)
    ):
        os.remove(cover_small_path)
