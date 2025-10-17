from enum import Enum
from typing import Any, cast
from django.http import HttpRequest
from ninja import ModelSchema, Schema

from api.schemas.user import ProfileBasicSchema
from api.shared.schemas import VoteSchema
from quiblet.models import Quib, Quiblet
from user.models import Profile

# --------------------
# Quiblet Schemas
# --------------------


class QuibletSchema(ModelSchema):
    members_count: int
    quibs_count: int
    has_joined: bool
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
            "created_at",
        ]

    @staticmethod
    def resolve_has_joined(obj: Quiblet, context: Any) -> bool:
        request = cast(HttpRequest, context["request"])
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            if profile_id := request.COOKIES.get("profile_id"):
                if Profile.objects.filter(user=user, id=profile_id).exists():
                    return obj.members.filter(id=profile_id).exists()
        return False

    @staticmethod
    def resolve_moderators(obj: Quiblet) -> list[Profile]:
        return [qm.member for qm in obj.moderators_cache]  # pyright: ignore[reportAttributeAccessIssue]


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
            "created_at",
        ]

    @staticmethod
    def resolve_content(obj: Quib) -> str | None:
        content = cast(str, obj.content)
        return content if content.strip() else None


class HighlightedQuib(ModelSchema):
    upvotes: int

    class Meta:
        model = Quib
        fields = ["id", "slug", "title", "cover_small"]
