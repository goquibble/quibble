from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress
from apps.user.models import User
from dj_rest_auth.registration.serializers import (
    RegisterSerializer as RestAuthRegisterSerializer,
)
from dj_rest_auth.serializers import LoginSerializer as RestAuthLoginSerializer
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .profile import ProfileBasicSerializer


class LoginSerializer(RestAuthLoginSerializer):
    """Custom LoginSerializer making email field required and removing username field"""

    username = None
    email = serializers.EmailField(required=True)


class RegisterSerializer(RestAuthRegisterSerializer):
    """Custom RegisterSerializer removing username field"""

    username = None

    # https://github.com/iMerica/dj-rest-auth/pull/680
    def validate_email(self, email):
        email = get_adapter().clean_email(email)

        if allauth_account_settings.UNIQUE_EMAIL:
            existing_email = EmailAddress.objects.filter(email=email).first()

            if existing_email:
                if (
                    not existing_email.verified
                    and allauth_account_settings.EMAIL_VERIFICATION
                    == allauth_account_settings.EmailVerificationMethod.MANDATORY
                ):
                    raise serializers.ValidationError(
                        _("This email is already in use but has not been verified.")
                    )
                raise serializers.ValidationError(
                    _("A user is already registered with this email address.")
                )

        return email


class UserDetailsSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "date_joined", "profile")

    @extend_schema_field(ProfileBasicSerializer)
    def get_profile(self, obj):
        request = self.context.get("request")
        user_profile = getattr(request, "user_profile", None)

        if user_profile:
            return ProfileBasicSerializer(
                user_profile, context={"request": request}
            ).data
        return None
