from django.core.cache import cache
from django.shortcuts import get_object_or_404
from django.http import HttpRequest
from ninja import Router

from api.schemas.quib import QuibSchema
from quib.models import Quib

router = Router()


@router.get("/", response=QuibSchema)
def get_quib(request: HttpRequest, id: str, slug: str):
    _ = request
    cache_key = f"quib:{id}:{slug}"
    if cached_data := cache.get(cache_key):
        return cached_data

    quib = get_object_or_404(Quib, id=id, slug=slug)
    cache.set(cache_key, quib, 5 * 60)  # 5 mins
    return quib
