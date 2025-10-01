from ninja import ModelSchema

from quib.models import Quib
from quiblet.models import Quiblet
from user.models import Profile


class QuibQuibletSchema(ModelSchema):
    class Meta:
        model = Quiblet
        fields = ["id", "name", "avatar"]


class QuibPosterSchema(ModelSchema):
    class Meta:
        model = Profile
        fields = ["id", "username", "avatar"]


class QuibSchema(ModelSchema):
    quiblet: QuibQuibletSchema
    poster: QuibPosterSchema

    class Meta:
        model = Quib
        fields = [
            "id",
            "slug",
            "title",
            "quiblet",
            "poster",
            "is_highlighted",
            "is_published",
            "cover",
            "cover_small",
            "content",
        ]
