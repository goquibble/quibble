from typing import cast
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router
from ninja.pagination import paginate

from api.http import CustomHttpRequest
from api.schemas.quiblet import QuibSchema
from api.schemas.root import SearchSchema
from quiblet.models import Quib, Quiblet
from quiblet.querysets import QuibQuerySet
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


@router.get("/feed", response=list[QuibSchema])
@paginate
def get_feed(request: CustomHttpRequest):
    quibs_qs = cast(QuibQuerySet, cast(object, Quib.objects))
    return quibs_qs.published().for_request(request).select_related("quiblet", "poster")
