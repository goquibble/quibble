# pyright: reportUnusedParameter=false
from typing import Any
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .tasks import moderate_quib

from .models import Quib


@receiver(post_delete, sender=Quib)
def delete_quib_cover_files(sender: Quib, instance: Quib, **kwargs: Any):
    """Post delete signal which deletes media files from storage."""
    if instance.cover:
        instance.cover.delete(save=False)
        instance.cover_small.delete(save=False)


@receiver(post_save, sender=Quib)
def schedule_quib_moderation(
    sender: type[Quib], instance: Quib, created: bool, **kwargs: Any
):
    """Schedule moderation task for new Quibs."""
    if created:
        moderate_quib.apply_async(args=[instance.id])
