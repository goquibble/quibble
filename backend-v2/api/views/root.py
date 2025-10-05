from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router
from ninja.pagination import paginate

from api.schemas.root import FeedQuibSchema, SearchSchema
from quiblet.models import Quib, Quiblet
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
def get_feed(request: HttpRequest):
    _ = request
    return (
        Quib.objects.filter(is_published=True)
        .select_related("quiblet")
        .defer("poster", "is_highlighted")
    )
