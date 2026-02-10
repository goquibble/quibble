from ninja import Schema
from uuid import UUID


class UserBasicSchema(Schema):
    id: UUID
    username: str | None = None
    name: str | None = None
    avatar_url: str | None = None
