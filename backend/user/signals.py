from typing import Any
from django.dispatch import receiver
from django.db.models.signals import post_save

from user.models import CustomUser, Profile


# pyright: reportUnusedParameter=false
@receiver(post_save, sender=CustomUser)
def create_profile_on_user_creation(
    sender: Any,
    instance: CustomUser,
    created: bool,
    **kwargs: Any,
):
    if created:
        base_username = instance.email.split("@")[0]
        username = base_username
        counter = 1

        while Profile.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        Profile.objects.create(user=instance, username=username)
