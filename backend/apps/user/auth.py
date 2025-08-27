from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import exceptions

from .models import Profile


class ExtendedJWTCookieAuthentication(JWTCookieAuthentication):
    """
    Extended JWTAuthentication
    which includes 'user_profile' field on request
    """

    def authenticate(self, request):
        user_auth_tuple = super().authenticate(request)
        if not user_auth_tuple:
            return None

        user, token = user_auth_tuple
        profile_id = request.COOKIES.get("profile-id")
        user_profile = None

        if profile_id is not None:
            try:
                user_profile = Profile.objects.get(id=profile_id, user=user)
            except Profile.DoesNotExist:
                raise exceptions.PermissionDenied(
                    "Invalid Profile! please re-login again."
                )

        request.user_profile = user_profile
        return (user, token)
