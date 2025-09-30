from ninja import ModelSchema

from quib.models import Quib
from quiblet.models import Quiblet


class QuibQuibletSchema(ModelSchema):
    class Meta:
        model = Quiblet
        fields = ["id", "name", "avatar"]


class QuibSchema(ModelSchema):
    quiblet: QuibQuibletSchema

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
