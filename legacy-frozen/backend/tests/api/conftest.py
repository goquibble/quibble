import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    """Retuns a DRF API client."""
    return APIClient()


@pytest.fixture
def auth_api_client(api_client, user_profile, token):
    """Returns an authenticated API client."""
    api_client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token.key}", HTTP_PROFILE_ID=str(user_profile.id)
    )
    return api_client
