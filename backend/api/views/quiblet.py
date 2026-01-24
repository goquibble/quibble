from typing import Literal, cast
from django.db import transaction
from django.db.models import Count, Prefetch
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import File, Form, Router, UploadedFile
from ninja.errors import HttpError

from api.auth import AuthBearer
from api.http import CustomHttpRequest
from api.schemas.quiblet import (
    CommentCreateInSchema,
    CommentSchema,
    HighlightedQuib,
    QuibSchema,
    QuibletCreateInSchema,
    QuibletCreateOutSchema,
    QuibletSchema,
)
from api.shared.schemas import UniqueNameResponseSchema
from api.utils import cache_response
from quiblet.managers import CommentManager
from quiblet.models import Comment, CommentVote, Quib, QuibVote, Quiblet, QuibletMember

router = Router()

# --------------------
# Quiblet Routes
# --------------------


@router.get("/is-unique", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):  # pyright: ignore[reportUnusedParameter]
    exists = Quiblet.objects.filter(name__iexact=name).exists()
    return {"unique": not exists}


@router.get("/{name}", response=QuibletSchema)
def get_quiblet(request: HttpRequest, name: str):  # pyright: ignore[reportUnusedParameter]
    def fetch():
        return get_object_or_404(
            Quiblet.objects.annotate(
                members_count=Count("members"), quibs_count=Count("quibs")
            ).prefetch_related(
                Prefetch(
                    "members",
                    to_attr="moderators_cache",
                    queryset=QuibletMember.objects.filter(is_moderator=True),
                )
            ),
            name=name,
            type="PUBLIC",
        )

    cache_key = f"quiblet:{name}"
    return cache_response(cache_key, fetch)


@router.get("/{name}/highlights", response=list[HighlightedQuib])
def get_quiblet_highlights(request: HttpRequest, name: str):  # pyright: ignore[reportUnusedParameter]
    def fetch():
        return Quib.objects.published().highlighted().for_quiblet(name)

    cache_key = f"quiblet:{name}:highlights"
    return cache_response(cache_key, fetch)


@router.get("/{name}/quibs", response=list[QuibSchema])
def get_quiblet_quibs(request: HttpRequest, name: str):
    def fetch():
        return (
            Quib.objects.published()
            .for_quiblet(name)
            .for_request(request)
            .for_request(request)
            .select_related("quiblet")
        )

    cache_key = f"quiblet:{name}:quibs"
    return cache_response(cache_key, fetch)


@router.post("/{name}/join-or-leave", auth=AuthBearer(), response={204: None})
def join_or_leave_quiblet(
    request: CustomHttpRequest, name: str, action: Literal["join", "leave"]
):
    quiblet = get_object_or_404(Quiblet, name=name)
    user_id = request.user_id

    with transaction.atomic():
        if action == "leave":
            quiblet.members.filter(member_id=user_id).delete()
        elif action == "join":
            quiblet.members.create(member_id=user_id)

    return 204, None


@router.post("/", auth=AuthBearer(), response=QuibletCreateOutSchema)
def create_quiblet(
    request: CustomHttpRequest,
    data: Form[QuibletCreateInSchema],
    avatar: File[UploadedFile] | None = None,
    banner: File[UploadedFile] | None = None,
):
    if Quiblet.objects.filter(name__iexact=data.name).exists():
        raise HttpError(400, f"Quiblet with name {data.name} already exists.")

    user_id = request.user_id
    quiblet = Quiblet(**data.model_dump())
    quiblet.save()
    quiblet.members.create(member_id=user_id, is_moderator=True)

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
    def fetch():
        return get_object_or_404(
            Quib.objects.published()
            .for_quiblet(name)
            .for_request(request)
            .select_related("quiblet"),
            id=id,
            slug=slug,
        )

    cache_key = f"quiblet:{name}:quib:{id}:{slug}"
    return cache_response(cache_key, fetch)


@router.post("/{name}/quib/{id}/{slug}/vote", auth=AuthBearer(), response={204: None})
def vote_quib(request: CustomHttpRequest, name: str, id: str, slug: str, value: int):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    QuibVote.objects.update_or_create(
        quib=quib, voter_id=request.user_id, defaults={"value": value}
    )
    return 204, None


# --------------------
# Comment Routes
# --------------------


@router.get("/{name}/quib/{id}/{slug}/comments", response=list[CommentSchema])
def get_comments(request: HttpRequest, name: str, id: str, slug: str):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    comments = cast(CommentManager, quib.comments)
    return comments.for_request(request)


@router.post(
    "/{name}/quib/{id}/{slug}/comments", auth=AuthBearer(), response=CommentSchema
)
def create_comment(
    request: CustomHttpRequest,
    data: CommentCreateInSchema,
    name: str,
    id: str,
    slug: str,
):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    parent_instance = None

    if data.parent_path:
        parent_instance = Comment.objects.filter(path=data.parent_path).first()
        if not parent_instance:
            raise HttpError(400, "Invalid parent_path")

    new_data = {"quib": quib, "commenter_id": request.user_id, "content": data.content}
    comment = Comment.objects.create_child(parent=parent_instance, **new_data)  # pyright: ignore[reportArgumentType]
    CommentVote.objects.create(comment=comment, voter_id=request.user_id, value=1)
    # re-fetch comment to get annotated fields
    comment = cast(
        Comment,
        Comment.objects.for_request(request).get(
            pk=cast(Comment, cast(object, comment)).pk
        ),
    )

    return comment
