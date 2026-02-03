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
    QuibCreateInSchema,
    QuibletCreateInSchema,
    QuibletCreateOutSchema,
    QuibletSchema,
    QuibletBasicSchema,
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


@router.get("/search", response=list[QuibletBasicSchema])
def search_quiblets(request: HttpRequest, q: str):  # pyright: ignore[reportUnusedParameter]
    return Quiblet.objects.filter(name__istartswith=q).annotate(
        members_count=Count("members")
    )[:10]


@router.get(
    "/{name}",
    response=QuibletSchema,
    auth=[AuthBearer(), lambda request: True],
)
def get_quiblet(request: HttpRequest, name: str):
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


@router.get(
    "/{name}/quibs",
    response=list[QuibSchema],
    auth=[AuthBearer(), lambda request: True],
)
def get_quiblet_quibs(request: HttpRequest, name: str):
    return (
        Quib.objects.published()
        .for_quiblet(name)
        .for_request(request)
        .select_related("quiblet")
    )


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


@router.get("/{name}/membership", auth=AuthBearer(), response={200: bool})
def get_membership_status(request: CustomHttpRequest, name: str):
    quiblet = get_object_or_404(Quiblet, name=name)
    return quiblet.members.filter(member_id=request.user_id).exists()


@router.get(
    "/member/list",
    auth=AuthBearer(),
    response=list[QuibletBasicSchema],
)
def get_user_quiblets(request: CustomHttpRequest):
    user_id = request.user_id
    # We can annotate members_count if needed by QuibletBasicSchema resolve_members_count
    # returning Quiblet objects will trigger Schema resolver.
    return (
        Quiblet.objects.filter(members__member_id=user_id)
        .annotate(members_count=Count("members"))
        .order_by("name")
    )


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


@router.post("/{name}/quib", auth=AuthBearer(), response=QuibSchema)
def create_quib(
    request: CustomHttpRequest,
    name: str,
    payload: Form[QuibCreateInSchema],
    cover: File[UploadedFile] | None = None,
):
    quiblet = get_object_or_404(Quiblet, name=name)

    quib = Quib(
        quiblet=quiblet,
        poster_id=request.user_id,
        title=payload.title,
        content=payload.content,
    )

    if actual_cover := cover or request.FILES.get("cover"):
        quib.cover.save(actual_cover.name, actual_cover)

    quib.save()
    QuibVote.objects.create(quib=quib, voter_id=request.user_id, value=1)

    return quib


@router.get(
    "/{name}/quib/{id}/{slug}",
    response=QuibSchema,
    auth=[AuthBearer(), lambda request: True],
)
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


@router.get("/{name}/quib/{id}/{slug}/vote", auth=AuthBearer(), response={200: int})
def get_quib_vote(request: CustomHttpRequest, name: str, id: str, slug: str):
    vote = (
        QuibVote.objects.filter(
            quib__quiblet__name=name,
            quib__id=id,
            quib__slug=slug,
            voter_id=request.user_id,
        )
        .values_list("value", flat=True)
        .first()
    )
    return 200, vote if vote is not None else 0


@router.post("/{name}/quib/{id}/{slug}/vote", auth=AuthBearer(), response={204: None})
def vote_quib(request: CustomHttpRequest, name: str, id: str, slug: str, value: int):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    QuibVote.objects.update_or_create(
        quib=quib, voter_id=request.user_id, defaults={"value": value}
    )
    return 204, None


@router.delete(
    "/{name}/quib/{id}/{slug}",
    auth=AuthBearer(),
    response={204: None},
)
def delete_quib(request: CustomHttpRequest, name: str, id: str, slug: str):
    quib = get_object_or_404(
        Quib,
        quiblet__name=name,
        id=id,
        slug=slug,
    )

    if quib.poster_id != request.user_id:
        raise HttpError(403, "You can only delete your own quibs.")

    quib.delete()
    return 204, None


# --------------------
# Comment Routes
# --------------------


@router.get(
    "/{name}/quib/{id}/{slug}/comments",
    response=list[CommentSchema],
    auth=[AuthBearer(), lambda request: True],
)
def get_comments(request: HttpRequest, name: str, id: str, slug: str):
    quib = get_object_or_404(Quib.objects.for_quiblet(name), id=id, slug=slug)
    comments = cast(CommentManager, quib.comments)
    return comments.for_request(request)


@router.post(
    "/{name}/quib/{id}/{slug}/comments",
    auth=AuthBearer(),
    response=CommentSchema,
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


@router.delete(
    "/{name}/quib/{id}/{slug}/comments/{comment_id}",
    auth=AuthBearer(),
    response={204: None},
)
def delete_comment(
    request: CustomHttpRequest,
    name: str,
    id: str,
    slug: str,
    comment_id: int,
):
    comment = get_object_or_404(
        Comment,
        id=comment_id,
        quib__quiblet__name=name,
        quib__id=id,
        quib__slug=slug,
    )

    if comment.commenter_id != request.user_id:
        raise HttpError(403, "You can only delete your own comments.")

    comment.is_deleted = True
    comment.save()

    return 204, None
