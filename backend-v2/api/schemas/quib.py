from typing import Any
from django.http import HttpRequest
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

    @staticmethod
    def resolve_cover(obj: Quib, context: Any):
        request: HttpRequest = context["request"]
        if obj.cover and isinstance(obj.cover.url, str):
            return request.build_absolute_uri(obj.cover.url)
        return None

    @staticmethod
    def resolve_cover_small(obj: Quib, context: Any):
        request: HttpRequest = context["request"]
        if obj.cover_small and isinstance(obj.cover_small.url, str):
            return request.build_absolute_uri(obj.cover_small.url)
        return None
