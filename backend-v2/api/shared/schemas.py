from ninja import Schema


class UniqueNameResponseSchema(Schema):
    unique: bool


class VoteSchema(Schema):
    upvotes: int
    downvotes: int
