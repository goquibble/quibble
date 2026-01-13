import pytest
from rest_framework.authtoken.models import Token

from apps.user.models import Profile, User


@pytest.fixture
def user():
    """Creates and returns a user."""
    return User.objects.create_user(
        email="test@test.com", password="testpass"
    )  # pyright: ignore


@pytest.fixture
def token(user):
    """Creats and returns an auth token."""
    return Token.objects.create(user=user)


@pytest.fixture
def user_profile(user):
    """Creates and returns a user profile"""
    return Profile.objects.create(user=user, username="test")
