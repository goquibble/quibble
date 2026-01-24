from typing import Optional
from uuid import UUID
import httpx
from django.conf import settings
from django.core.cache import cache
from pydantic import BaseModel


class User(BaseModel):
    id: UUID
    email: str
    username: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None
    is_staff: bool = False
    is_superuser: bool = False

    @property
    def check_is_staff(self) -> bool:
        # Compatibility property if needed
        return self.is_staff or self.is_superuser


def fetch_user(user_id: UUID | str) -> Optional[User]:
    """
    Fetch user details from Auth Service by ID.
    Uses Redis cache.
    """
    if not user_id:
        return None

    cache_key = f"user_details:{user_id}"
    cached_data = cache.get(cache_key)

    if cached_data:
        try:
            return User(**cached_data)
        except Exception:
            # invalid cache
            pass

    auth_service_url = getattr(settings, "AUTH_SERVICE_URL", "http://localhost:8002")
    url = f"{auth_service_url}/api/v1/users/{user_id}"

    try:
        # Use httpx for the request (or requests if preferred, keeping it sync for now)
        # Using a timeout is good practice
        response = httpx.get(url, timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            # Cache for 5 minutes (300 seconds)
            cache.set(cache_key, data, timeout=300)
            return User(**data)
    except Exception:
        # Log error in production
        return None

    return None


def get_user_from_token(token: str) -> Optional[User]:
    """
    Validate token and get user from Auth Service.
    Token should be a Bearer token.
    Uses Redis cache by token hash.
    """
    import hashlib

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    cache_key = f"auth_token_user:{token_hash}"
    cached_data = cache.get(cache_key)

    if cached_data:
        try:
            return User(**cached_data)
        except Exception:
            pass

    auth_service_url = getattr(settings, "AUTH_SERVICE_URL", "http://localhost:8002")
    url = f"{auth_service_url}/api/v1/users/me"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = httpx.get(url, headers=headers, timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            # Cache for 60 seconds
            cache.set(cache_key, data, timeout=60)
            return User(**data)
    except Exception:
        return None

    return None
