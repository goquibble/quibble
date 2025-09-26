from typing import Any
from ninja import ModelSchema

from api.schemas.user import ProfileSchema
from quiblet.models import Quiblet


class QuibletSchema(ModelSchema):
    members_count: int
    moderators: list[ProfileSchema]

    class Meta:
        model = Quiblet
        fields = [
            "id",
            "name",
            "title",
            "avatar",
            "banner",
            "description",
            "type",
            "nsfw",
            "moderators",
            "created_at",
        ]

    @staticmethod
    def resolve_members_count(obj: Quiblet):
        return obj.members.count()

    @staticmethod
    def resolve_avatar(obj: Quiblet, context: Any):
        request = context["request"]
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    @staticmethod
    def resolve_banner(obj: Quiblet, context: Any):
        request = context["request"]
        if obj.banner:
            return request.build_absolute_uri(obj.banner.url)
        return None
