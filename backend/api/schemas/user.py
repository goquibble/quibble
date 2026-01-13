from ninja import ModelSchema

from user.models import Profile


class ProfileBasicSchema(ModelSchema):
    class Meta:
        model = Profile
        fields = ["id", "username", "name", "avatar"]
