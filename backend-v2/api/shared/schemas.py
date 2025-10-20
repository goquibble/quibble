from typing import Any
from ninja import Schema


class UniqueNameResponseSchema(Schema):
    unique: bool


class VoteSchema(Schema):
    upvotes: int
    downvotes: int
    user_vote_value: int | None

    @staticmethod
    def resolve_upvotes(obj: Any) -> int:
        """Resolve `upvotes` by checking if object has annotated attr or not."""
        if hasattr(obj, "upvotes"):
            return obj.upvotes
        return obj.votes.filter(value=1).count()

    @staticmethod
    def resolve_downvotes(obj: Any) -> int:
        """Resolve `downvotes` by checking if object has annotated attr or not."""
        if hasattr(obj, "downvotes"):
            return obj.downvotes
        return obj.votes.filter(value=-1).count()

    @staticmethod
    def resolve_user_vote_value(obj: Any) -> int | None:
        if hasattr(obj, "user_vote") and obj.user_vote:
            return obj.user_vote[0].value
        return None
