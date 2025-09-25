from django.core.cache import cache
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

from api.schemas.quiblet import QuibletSchema
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quiblet

router = Router()


@router.get("/", response=QuibletSchema)
def get_quiblet(request: HttpRequest, name: str):
    _ = request
    cache_key = f"quiblet:{name}"
    quiblet = cache.get(cache_key)
    if not quiblet:  # cache miss
        quiblet = get_object_or_404(Quiblet, name=name)
        cache.set(cache_key, quiblet, timeout=5 * 60)  # 5 mins
    return quiblet


@router.get("/is-unique-name", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    exists = Quiblet.objects.filter(name=name).exists()
    return {"unique": not exists}
