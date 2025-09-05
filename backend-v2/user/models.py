from django.contrib.auth.models import AbstractUser
from django.db import models

from user.managers import CustomUserManager


class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True, blank=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  # pyright: ignore[reportAssignmentType]
