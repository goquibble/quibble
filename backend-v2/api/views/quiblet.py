from django.core.cache import cache
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import File, Form, Router, UploadedFile
from ninja.errors import HttpError

from api.schemas.quiblet import QuibletCreateSchema, QuibletSchema
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quiblet

router = Router()


@router.get("/", response=QuibletSchema)
def get_quiblet(request: HttpRequest, name: str):
    _ = request
    cache_key = f"quiblet:{name}"
    if cached_data := cache.get(cache_key):
        return cached_data

    quiblet = get_object_or_404(Quiblet, name=name)
    cache.set(cache_key, quiblet, timeout=5 * 60)  # 5 mins
    return quiblet


@router.post("/", response=QuibletSchema)
def create_quiblet(
    request: HttpRequest,
    data: Form[QuibletCreateSchema],
    avatar: File[UploadedFile | None] = None,
    banner: File[UploadedFile | None] = None,
):
    _ = request
    if Quiblet.objects.filter(name__iexact=data.name).exists():
        raise HttpError(400, f"Quiblet with name {data.name} already exists.")
    quiblet = Quiblet(**data.model_dump())

    if avatar is not None:
        quiblet.avatar.save(avatar.name, avatar)
    if banner is not None:
        quiblet.banner.save(banner.name, banner)

    quiblet.save()
    return quiblet


@router.get("/is-unique-name", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    exists = Quiblet.objects.filter(name=name).exists()
    return {"unique": not exists}
