from typing import Any
from ninja import Schema


class UniqueNameResponseSchema(Schema):
    unique: bool


class VoteSchema(Schema):
    upvotes: int
    downvotes: int
    user_vote_value: int | None

    @staticmethod
    def resolve_user_vote_value(obj: Any) -> int | None:
        if hasattr(obj, "user_vote") and obj.user_vote:
            return obj.user_vote[0].value
        return None
