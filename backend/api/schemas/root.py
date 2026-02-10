from ninja import Schema
from uuid import UUID

from quiblet.models import Quiblet

# --------------------
# Search Schemas
# --------------------


class SearchQuibletSchema(Schema):
    id: int
    name: str
    avatar_url: str | None
    members_count: int

    @staticmethod
    def resolve_members_count(obj: Quiblet):
        return obj.members.count()


class SearchProfileSchema(Schema):
    id: UUID
    username: str
    name: str | None
    avatar_url: str | None


class SearchSchema(Schema):
    quiblets: list[SearchQuibletSchema]
    profiles: list[SearchProfileSchema]
