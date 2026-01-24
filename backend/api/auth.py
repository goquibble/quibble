from typing import Optional
from ninja.security import HttpBearer
from django.http import HttpRequest
from core.services.auth import get_user_from_token, User


class AuthBearer(HttpBearer):
    def authenticate(self, request: HttpRequest, token: str) -> Optional[User]:
        user = get_user_from_token(token)
        if user:
            # Attach user to request for easy access
            request.user_id = user.id  # type: ignore
            request.auth_user = user  # type: ignore
            return user
        return None
