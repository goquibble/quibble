from ninja import Router
from typing import List
from pgvector.django import CosineDistance

from quiblet.models import Quib
from api.schemas.quiblet import QuibSchema
from .services import generate_embedding

router = Router()


@router.get("/search", response=List[QuibSchema])
def semantic_search(request, q: str):
    if not q:
        return []

    query_embedding = generate_embedding(q)
    if not query_embedding:
        return []

    # Get Quibs ordered by cosine distance (similarity)
    # We use with_votes() to ensure all annotated fields required by QuibSchema are present.
    # We join with the embedding table to filter quibs that have embeddings.
    # Cosine distance is 1 - cosine_similarity, so smaller distance is better.

    quibs = (
        Quib.objects.with_votes()
        .filter(embedding__isnull=False)
        .annotate(distance=CosineDistance("embedding__embedding", query_embedding))
        .order_by("distance")[:20]
    )

    return list(quibs)
