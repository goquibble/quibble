from ninja import ModelSchema

from user.models import Profile


class ProfileSchema(ModelSchema):
    class Meta:
        model = Profile
        fields = ["id", "username", "name", "avatar"]


class ProfilePreviewSchema(ProfileSchema):
    class Meta(ProfileSchema.Meta):
        exclude = ["name"]
