from enum import Enum
from typing import cast
from ninja import ModelSchema, Schema

from api.schemas.user import ProfileBasicSchema
from api.shared.schemas import VoteSchema
from quiblet.models import Quib, Quiblet

# --------------------
# Quiblet Schemas
# --------------------


class QuibletSchema(ModelSchema):
    members_count: int
    moderators: list[ProfileBasicSchema]

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


class QuibletBasicSchema(ModelSchema):
    class Meta:
        model = Quiblet
        fields = ["id", "name", "avatar"]


class QuibletType(str, Enum):
    PUBLIC = "PUBLIC"
    RESTRICTED = "RESTRICTED"
    PRIVATE = "PRIVATE"


class QuibletCreateInSchema(Schema):
    name: str
    description: str
    type: QuibletType
    nsfw: bool


class QuibletCreateOutSchema(Schema):
    name: str


# --------------------
# Quib Schemas
# --------------------


class QuibSchema(ModelSchema, VoteSchema):
    quiblet: QuibletBasicSchema
    poster: ProfileBasicSchema

    class Meta:
        model = Quib
        fields = [
            "id",
            "slug",
            "title",
            "is_highlighted",
            "cover",
            "cover_small",
            "content",
        ]

    @staticmethod
    def resolve_content(obj: Quib) -> str | None:
        content = cast(str, obj.content)
        return content if content.strip() else None
