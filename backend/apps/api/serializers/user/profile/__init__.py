from apps.api.serializers.user import UserSerializer
from apps.user.models import Profile
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


class ProfileBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("id", "username", "avatar", "name")


class ProfileTotalCountSerializer(serializers.Serializer):
    total_count = serializers.IntegerField()
