from apps.user.models import User
from django.contrib.auth.backends import ModelBackend


class EmailAuthBackend(ModelBackend):
    """
    Custom Auth backend with email instead username
    """

    def authenticate(
        self, request, email=None, password=None, **kwargs
    ):  # pyright: ignore
        try:
            user = User.objects.get(email=email)
            if password and user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id: int):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
