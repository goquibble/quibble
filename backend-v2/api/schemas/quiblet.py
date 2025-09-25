from typing import Any
from ninja import ModelSchema

from quiblet.models import Quiblet


class QuibletSchema(ModelSchema):
    class Meta:
        model = Quiblet
        fields = [
            "id",
            "name",
            "description",
            "title",
            "avatar",
            "banner",
            "type",
            "nsfw",
            "members",
            "moderators",
            "created_at",
        ]

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
