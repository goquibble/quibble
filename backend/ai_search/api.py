from ninja import ModelSchema, Router
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


@router.get("/search", response=List[QuibSearchSchema])
def semantic_search(request, q: str):
    if not q:
        return []

    query_embedding = generate_embedding(q)
    if not query_embedding:
        return []

    # Get Quibs ordered by cosine distance (similarity)
    # We join with the embedding table to filter quibs that have embeddings.
    # Cosine distance is 1 - cosine_similarity, so smaller distance is better.

    # Filter for results with high similarity (distance < 0.55)
    # Cosine distance ranges from 0 (identical) to 2 (opposite).
    # A distance of 0.55 roughly corresponds to a cosine similarity of 0.45,
    # which generally indicates relevant content for most embedding models.
    quibs = (
        Quib.objects.select_related("quiblet")
        .filter(embedding__isnull=False)
        .annotate(distance=CosineDistance("embedding__embedding", query_embedding))
        .filter(distance__lt=0.55)
        .order_by("distance")[:20]
    )

    return list(quibs)
