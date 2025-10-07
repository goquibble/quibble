from django.db.models import Prefetch
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router
from ninja.pagination import paginate

from api.http import CustomHttpRequest
from api.schemas.root import FeedQuibSchema, SearchSchema
from quiblet.models import Quib, QuibVote, Quiblet
from user.models import Profile

router = Router()


# --------------------
# Auth Related Routes
# --------------------


@router.get("/csrftoken", response={204: None})
@ensure_csrf_cookie
def set_csrftoken(request: HttpRequest):
    _ = request
    return HttpResponse(status=204)


# --------------------
# Search Routes
# --------------------


@router.get("/search", response=SearchSchema)
def search(request: HttpRequest, q: str):
    _ = request
    quiblets = Quiblet.objects.filter(name__istartswith=q)
    profiles = Profile.objects.filter(username__istartswith=q)

    return {"quiblets": quiblets, "profiles": profiles}


# --------------------
# Feed Routes
# --------------------


@router.get("/feed", response=list[FeedQuibSchema])
@paginate
def get_feed(request: CustomHttpRequest):
    quibs = (
        Quib.objects.filter(is_published=True)
        .select_related("quiblet")
        .defer("poster", "is_highlighted")
    )

    if request.user and request.user.is_authenticated:
        voter = Profile.objects.get(user=request.user)
        quibs = quibs.prefetch_related(
            Prefetch(
                "votes",
                queryset=QuibVote.objects.filter(voter=voter),
                to_attr="user_vote",
            )
        )

    return quibs
