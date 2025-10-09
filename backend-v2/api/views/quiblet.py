from typing import cast
from django.core.cache import cache
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import File, Form, Router, UploadedFile
from ninja.errors import HttpError

from api.auth import ProfileAuth
from api.http import CustomHttpRequest
from api.schemas.quiblet import (
    QuibSchema,
    QuibletCreateInSchema,
    QuibletCreateOutSchema,
    QuibletSchema,
)
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quib, QuibVote, Quiblet
from quiblet.querysets import QuibQuerySet
from user.models import Profile

router = Router()

# --------------------
# Quiblet Routes
# --------------------


@router.get("/is-unique", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    exists = Quiblet.objects.filter(name__iexact=name).exists()
    return {"unique": not exists}


@router.get("/{name}", response=QuibletSchema)
def get_quiblet(request: HttpRequest, name: str):
    _ = request
    cache_key = f"quiblet:{name}"
    if cached_data := cache.get(cache_key):
        return cached_data

    quiblet = get_object_or_404(Quiblet, name=name)
    cache.set(cache_key, quiblet, timeout=5 * 60)  # 5 mins
    return quiblet


@router.get("/{name}/quibs", response=list[QuibSchema])
def get_quiblet_quibs(request: HttpRequest, name: str):
    quibs_qs = cast(QuibQuerySet, cast(object, Quib.objects))
    return (
        quibs_qs.published()
        .for_quiblet(name)
        .for_request(request)
        .select_related("quiblet", "poster")
    )


@router.post("/", auth=ProfileAuth(), response=QuibletCreateOutSchema)
def create_quiblet(
    request: CustomHttpRequest,
    data: Form[QuibletCreateInSchema],
    avatar: File[UploadedFile] | None = None,
    banner: File[UploadedFile] | None = None,
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


# --------------------
# Quib Routes
# --------------------


@router.get("/{name}/quib/{id}/{slug}", response=QuibSchema)
def get_quib(request: HttpRequest, name: str, id: str, slug: str):
    _ = request
    cache_key = f"quib:{id}:{slug}"
    if cached_data := cache.get(cache_key):
        return cached_data

    quib_qs = cast(QuibQuerySet, cast(object, Quib.objects))
    quib = get_object_or_404(quib_qs.published().for_quiblet(name), id=id, slug=slug)
    cache.set(cache_key, quib, 5 * 60)  # 5 mins
    return quib


@router.post("/{name}/quib/{id}/{slug}/vote", auth=ProfileAuth(), response={204: None})
def vote_quib(request: CustomHttpRequest, name: str, id: str, slug: str, value: int):
    quib = get_object_or_404(Quib, quiblet__name=name, id=id, slug=slug)
    QuibVote.objects.update_or_create(
        quib=quib, voter=request.user_p, defaults={"value": value}
    )
    return 204, None
