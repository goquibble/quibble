from ninja import ModelSchema, Router, Schema
from typing import List, cast
from pgvector.django import CosineDistance

from quiblet.models import Quib
from api.schemas.quiblet import QuibletBasicSchema
from .services import generate_embedding

router = Router()


class QuibSearchSchema(ModelSchema):
    quiblet: QuibletBasicSchema

    class Meta:
        model = Quib
        fields = [
            "id",
            "slug",
            "title",
            "cover",
            "content",
            "created_at",
        ]

    @staticmethod
    def resolve_content(obj: Quib) -> str | None:
        content = cast(str, obj.content)
        return content if content and content.strip() else None


class SemanticSearchResponse(Schema):
    results: List[QuibSearchSchema]
    similar_items: List[QuibSearchSchema]


@router.get("/search", response=SemanticSearchResponse)
def semantic_search(request, q: str):
    if not q:
        return {"results": [], "similar_items": []}

    query_embedding = generate_embedding(q)
    if not query_embedding:
        return {"results": [], "similar_items": []}

    # Base query annotated with distance
    base_qs = (
        Quib.objects.select_related("quiblet")
        .filter(embedding__isnull=False)
        .annotate(distance=CosineDistance("embedding__embedding", query_embedding))
    )

    # High similarity results: distance < 0.55, top 10
    results = list(base_qs.filter(distance__lt=0.55).order_by("distance")[:10])

    # Similar items: distance >= 0.55, top 5
    # (assuming we want the "next best" which are still somewhat relevant,
    # so we still order by distance ascending)
    similar_items = list(base_qs.filter(distance__gte=0.55).order_by("distance")[:5])

    return {"results": results, "similar_items": similar_items}
