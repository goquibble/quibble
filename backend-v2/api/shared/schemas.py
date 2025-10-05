from ninja import Schema


class SuccessResponseSchema(Schema):
    success: bool


class UniqueNameResponseSchema(Schema):
    unique: bool
