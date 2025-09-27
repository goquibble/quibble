from typing import cast
from django.core.cache import cache
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import File, Form, Router, UploadedFile
from ninja.errors import HttpError

from api.auth import ProfileAuth
from api.http import CustomHttpRequest
from api.schemas.quiblet import (
    QuibletCreateInSchema,
    QuibletCreateOutSchema,
    QuibletSchema,
)
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quiblet
from user.models import Profile

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


@router.post("/", auth=ProfileAuth(), response=QuibletCreateOutSchema)
def create_quiblet(
    request: CustomHttpRequest,
    data: Form[QuibletCreateInSchema],
    avatar: File[UploadedFile | None] = None,
    banner: File[UploadedFile | None] = None,
):
    if Quiblet.objects.filter(name__iexact=data.name).exists():
        raise HttpError(400, f"Quiblet with name {data.name} already exists.")

    user_p = cast(Profile, request.user_p)
    quiblet = Quiblet(**data.model_dump())
    quiblet.save()

    quiblet.members.add(user_p)
    quiblet.moderators.add(user_p)

    if avatar is not None:
        quiblet.avatar.save(avatar.name, avatar)
    if banner is not None:
        quiblet.banner.save(banner.name, banner)

    return {"name": data.name}


@router.get("/is-unique-name", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    exists = Quiblet.objects.filter(name=name).exists()
    return {"unique": not exists}
