from typing import Literal
from django.db import transaction
from django.core.cache import cache
from django.db.models import Count, Prefetch
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import File, Form, Router, UploadedFile
from ninja.errors import HttpError

from api.auth import ProfileAuth
from api.http import CustomHttpRequest
from api.schemas.quiblet import (
    HighlightedQuib,
    QuibSchema,
    QuibletCreateInSchema,
    QuibletCreateOutSchema,
    QuibletSchema,
)
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quib, QuibVote, Quiblet, QuibletMember

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

    quiblet = get_object_or_404(
        Quiblet.objects.annotate(
            members_count=Count("members"), quibs_count=Count("quibs")
        ).prefetch_related(
            Prefetch(
                "members",
                to_attr="moderators_cache",
                queryset=QuibletMember.objects.filter(is_moderator=True).select_related(
                    "member"
                ),
            )
        ),
        name=name,
        type="PUBLIC",
    )
    cache.set(cache_key, quiblet, timeout=5 * 60)  # 5 mins
    return quiblet


@router.get("/{name}/highlights", response=list[HighlightedQuib])
def get_quiblet_highlights(request: HttpRequest, name: str):
    _ = request
    cache_key = f"quiblet:{name}:highlights"
    if cached_data := cache.get(cache_key):
        return cached_data

    quibs = Quib.objects.published().highlighted().for_quiblet(name)
    cache.set(cache_key, quibs, timeout=5 * 60)  # 5 mins
    return quibs


@router.get("/{name}/quibs", response=list[QuibSchema])
def get_quiblet_quibs(request: HttpRequest, name: str):
    return (
        Quib.objects.published()
        .for_quiblet(name)
        .for_request(request)
        .select_related("quiblet", "poster")
    )


@router.post("/{name}/join-or-leave", auth=ProfileAuth(), response={204: None})
def join_or_leave_quiblet(
    request: CustomHttpRequest, name: str, action: Literal["join", "leave"]
):
    quiblet = get_object_or_404(Quiblet, name=name)
    user_p = request.user_p

    with transaction.atomic():
        if action == "leave":
            quiblet.members.filter(member=user_p).delete()
        elif action == "join":
            quiblet.members.create(member=user_p)

    return 204, None


@router.post("/", auth=ProfileAuth(), response=QuibletCreateOutSchema)
def create_quiblet(
    request: CustomHttpRequest,
    data: Form[QuibletCreateInSchema],
    avatar: File[UploadedFile] | None = None,
    banner: File[UploadedFile] | None = None,
):
    if Quiblet.objects.filter(name__iexact=data.name).exists():
        raise HttpError(400, f"Quiblet with name {data.name} already exists.")

    user_p = request.user_p
    quiblet = Quiblet(**data.model_dump())
    quiblet.save()

    quiblet.members.create(member=user_p)

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

    quib = get_object_or_404(
        Quib.objects.published()
        .for_quiblet(name)
        .for_request(request)
        .select_related("quiblet", "poster"),
        id=id,
        slug=slug,
    )

    cache.set(cache_key, quib, 5 * 60)  # 5 mins
    return quib


@router.post("/{name}/quib/{id}/{slug}/vote", auth=ProfileAuth(), response={204: None})
def vote_quib(request: CustomHttpRequest, name: str, id: str, slug: str, value: int):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    QuibVote.objects.update_or_create(
        quib=quib, voter=request.user_p, defaults={"value": value}
    )
    return 204, None
