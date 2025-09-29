from ninja import ModelSchema

from quib.models import Quib


class QuibSchema(ModelSchema):
    class Meta:
        model = Quib
        fields = ["id", "title", "slug"]
