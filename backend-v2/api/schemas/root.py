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


class SearchProfileSchema(Schema):
    id: int
    username: str
    name: str | None
    avatar: str | None


class SearchSchema(Schema):
    quiblets: list[SearchQuibletSchema]
    profiles: list[SearchProfileSchema]
