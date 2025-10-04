# pyright: reportUnusedParameter=false
from typing import Any
from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Quib


@receiver(post_delete, sender=Quib)
def delete_quib_cover_files(sender: Quib, instance: Quib, **kwargs: Any):
    """Post delete signal which deletes media files from storage."""
    if instance.cover:
        instance.cover.delete(save=False)
        instance.cover_small.delete(save=False)
