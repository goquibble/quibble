from typing import Any
from ninja import ModelSchema

from user.models import Profile


class ProfileSchema(ModelSchema):
    class Meta:
        model = Profile
        fields = ["id", "username", "name", "avatar"]

    @staticmethod
    def resolve_avatar(obj: Profile, context: Any):
        request = context["request"]
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None
