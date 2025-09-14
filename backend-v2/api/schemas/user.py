from ninja import ModelSchema, Schema

from user.models import Profile


class ProfileOutSchema(Schema):
    id: int
    username: str


class ProfileSchema(ModelSchema):
    class Meta:
        model = Profile
        fields = ["id", "username"]
