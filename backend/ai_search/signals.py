from django.db.models.signals import post_save
from django.dispatch import receiver
from quiblet.models import Quib
from .tasks import generate_quib_embedding_task


@receiver(post_save, sender=Quib)
def update_quib_embedding(sender, instance, created, **kwargs):
    # Trigger Celery task to generate embedding asynchronously
    # This avoids blocking the request/response cycle
    generate_quib_embedding_task.delay(instance.id)
