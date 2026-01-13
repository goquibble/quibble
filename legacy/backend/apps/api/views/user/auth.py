import os

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LogoutView as RestAuthLogoutAPIView
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from apps.user.models import Profile
from core.clients import CustomOAuth2Client


class SelectProfileAPIView(views.APIView):
    """API View to select profile which sets cookie to response"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, profile_id=None):
        profile = generics.get_object_or_404(Profile, id=profile_id, user=request.user)

        response = Response({})
        response.set_cookie(
            "profile-id",
            value=str(profile.pk),
            expires=timezone.now() + timezone.timedelta(days=7),
            httponly=True,
            secure=False if settings.DEBUG else True,
            samesite="Lax",
            domain=os.getenv("DJANGO_COOKIE_DOMAIN"),
        )

        return response


class LogoutAPIView(RestAuthLogoutAPIView):
    """
    Extended Logout view which also deletes profile-id from cookies,
    Inherits dj-rest-auth LogoutView.

    Accepts/Returns nothing.
    """

    # POST requests only
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # clear profile-id cookie
        response.delete_cookie("profile-id")

        return response


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.OAUTH_CALLBACK_URL
    client_class = CustomOAuth2Client
