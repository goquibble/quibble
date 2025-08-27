from apps.api.serializers.user import UserSerializer
from apps.api.serializers.user.profile import ProfileSerializer
from apps.api.utils import unset_jwt_cookies_with_profile_id
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response


@extend_schema(tags=["user & profiles"])
class MeAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user, context={"request": request})
        return Response(serializer.data)

    def delete(self, request):
        try:
            request.user.delete()
            response = Response(
                {"detail": "User account deleted successfully!"},
                status=status.HTTP_204_NO_CONTENT,
            )
            unset_jwt_cookies_with_profile_id(response)

            return response
        except Exception as e:
            raise ValidationError(f"An unexpected error occured: {str(e)}")


@extend_schema(tags=["user & profiles"])
class MeProfileAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ProfileSerializer

    def get(self, request):
        serializer = self.serializer_class(
            request.user_profile, context={"request": request}
        )
        return Response(serializer.data)

    def delete(self, request):
        user_profile = request.user_profile
        if user_profile is None:
            raise ValidationError("No profile is selected for deletion.")

        try:
            user_profile.delete()
            response = Response(
                {"detail": "Profile deleted successfully!"},
                status=status.HTTP_204_NO_CONTENT,
            )
            unset_jwt_cookies_with_profile_id(response)

            return response
        except Exception as e:
            raise ValidationError(f"An unexpected error occured: {str(e)}")
