from ninja import ModelSchema, Schema

from api.schemas.quiblet import QuibletPreviewSchema
from api.shared.schemas import VoteSchema
from quiblet.models import Quib, Quiblet

# --------------------
# Search Schemas
# --------------------


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


# --------------------
# Feed Schemas
# --------------------


class FeedQuibSchema(ModelSchema, VoteSchema):
    quiblet: QuibletPreviewSchema

    class Meta:
        model = Quib
        fields = [
            "id",
            "slug",
            "title",
            "cover",
            "cover_small",
            "content",
        ]
