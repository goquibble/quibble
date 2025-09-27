from typing import Any
from ninja import Schema

from quiblet.models import Quiblet


class SearchQuibletSchema(Schema):
    id: int
    name: str
    avatar: str | None
    members_count: int

    @staticmethod
    def resolve_members_count(obj: Quiblet):
        return obj.members.count()

    @staticmethod
    def resolve_avatar(obj: Quiblet, context: Any):
        request = context["request"]
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class SearchProfileSchema(Schema):
    id: int
    username: str
    name: str | None
    avatar: str | None

    @staticmethod
    def resolve_avatar(obj: Quiblet, context: Any):
        request = context["request"]
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class SearchSchema(Schema):
    quiblets: list[SearchQuibletSchema]
    profiles: list[SearchProfileSchema]
