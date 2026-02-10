from enum import Enum
from typing import Any, cast
from django.http import HttpRequest
from ninja import ModelSchema, Schema

from api.schemas.user import UserBasicSchema
from api.shared.schemas import VoteSchema
from core.services.auth import fetch_user
from quiblet.models import Comment, Quib, Quiblet

# --------------------
# Quiblet Schemas
# --------------------


class QuibletSchema(ModelSchema):
    members_count: int
    quibs_count: int
    has_joined: bool
    moderators: list[UserBasicSchema]

    class Meta:
        model = Quiblet
        fields = [
            "id",
            "name",
            "title",
            "avatar_url",
            "banner",
            "description",
            "type",
            "nsfw",
            "created_at",
        ]

    @staticmethod
    def resolve_has_joined(obj: Quiblet, context: Any) -> bool:
        request = cast(HttpRequest, context["request"])
        user_id = getattr(request, "user_id", None)
        if user_id:
            # Check if user_id is in members
            return obj.members.filter(member_id=user_id).exists()
        return False

    @staticmethod
    def resolve_moderators(obj: Quiblet) -> list[Any]:
        # obj.moderators_cache should be populated by prefetch logic if available
        # But generally accessing obj.members.filter(is_moderator=True)
        # Assuming moderators_cache works on QuibletMember
        moderator_members = [
            m for m in getattr(obj, "moderators_cache", []) if m.is_moderator
        ]
        if not moderator_members:
            # Fallback if cache not present
            moderator_members = obj.members.filter(is_moderator=True)

        users = []
        for mod in moderator_members:
            u = fetch_user(mod.member_id)
            if u:
                users.append(u)
        return users


class QuibletBasicSchema(ModelSchema):
    members_count: int

    class Meta:
        model = Quiblet
        fields = ["id", "name", "avatar_url"]

    is_favorite: bool

    @staticmethod
    def resolve_is_favorite(obj: Quiblet) -> bool:
        return getattr(obj, "is_favorite", False)

    @staticmethod
    def resolve_members_count(obj: Quiblet) -> int:
        return getattr(obj, "members_count", obj.members.count())


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


class QuibCreateInSchema(Schema):
    title: str
    content: str | None = None


class QuibSchema(ModelSchema, VoteSchema):
    comments_count: int
    quiblet: QuibletBasicSchema
    poster: UserBasicSchema | None

    class Meta:
        model = Quib
        fields = [
            "id",
            "slug",
            "title",
            "is_highlighted",
            "status",
            "cover",
            "cover_small",
            "content",
            "created_at",
        ]

    @staticmethod
    def resolve_poster(obj: Quib) -> Any | None:
        if not obj.poster_id:
            return None
        return fetch_user(obj.poster_id)

    @staticmethod
    def resolve_upvotes(obj: Quib) -> int:
        return getattr(obj, "upvotes", 0)

    @staticmethod
    def resolve_downvotes(obj: Quib) -> int:
        return getattr(obj, "downvotes", 0)

    @staticmethod
    def resolve_comments_count(obj: Quib) -> int:
        return getattr(obj, "comments_count", 0)

    @staticmethod
    def resolve_content(obj: Quib) -> str | None:
        content = cast(str, obj.content)
        return content if content.strip() else None


class HighlightedQuib(ModelSchema):
    upvotes: int

    class Meta:
        model = Quib
        fields = ["id", "slug", "title", "cover_small"]


# --------------------
# Comment Schemas
# --------------------


class CommentSchema(ModelSchema, VoteSchema):
    commenter: UserBasicSchema | None
    path: str

    class Meta:
        model = Comment
        fields = [
            "id",
            "commenter_id",
            "content",
            "is_deleted",
            "is_moderator",
            "created_at",
        ]

    @staticmethod
    def resolve_commenter(obj: Comment) -> Any | None:
        if not obj.commenter_id:
            return None
        return fetch_user(obj.commenter_id)

    @staticmethod
    def resolve_path(obj: Comment):
        return str(cast(str, obj.path))


class CommentCreateInSchema(Schema):
    parent_path: str | None = None
    content: str
