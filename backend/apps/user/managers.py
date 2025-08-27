from typing import Any

from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    for authentication instead usernamess.
    """

    use_in_migrations = True

    def _create_user(self, email: str, password: str | None, **extra_fields: Any):
        """
        base function to save user with email and password (if given)
        """
        from .models import User  # prevent circular import

        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user: User = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: None = None, **extra_fields: Any):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str, **extra_fields: Any):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        # sanity checking
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have superuser=True")

        return self._create_user(email, password, **extra_fields)
