from typing import Any, override
from django.http import HttpRequest
from ninja.errors import HttpError
from ninja.security import SessionAuth

from user.models import Profile

class ProfileAuth(SessionAuth):
    @override
    def authenticate(self, request: HttpRequest, key: str | None) -> Any:
        user = super().authenticate(request, key)
        if not user:
            return None

        profile_id = request.headers.get("X-Profile-Id")
        if not profile_id:
            raise HttpError(400, "Please select a profile to continue.")

        try:
            user_p = Profile.objects.get(user=user, id=profile_id)
        except Profile.DoesNotExist:
            raise HttpError(403, "The selected profile is invalid. Please try again.")

        request.user_p = user_p # pyright: ignore[reportAttributeAccessIssue]
        return user
