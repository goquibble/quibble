from enum import Enum
from ninja import ModelSchema, Schema

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
