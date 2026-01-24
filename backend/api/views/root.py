from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router
from ninja.pagination import paginate

from api.http import CustomHttpRequest
from api.schemas.quiblet import QuibSchema
from api.schemas.root import SearchSchema
from quiblet.models import Quib, Quiblet

router = Router()


# --------------------
# Auth Related Routes
# --------------------


@router.get("/csrftoken", response={204: None})
@ensure_csrf_cookie  # ty:ignore[invalid-argument-type]
def set_csrftoken(request: HttpRequest):  # pyright: ignore[reportUnusedParameter]
    return HttpResponse(status=204)


# --------------------
# Search Routes
# --------------------


@router.get("/search", response=SearchSchema)
def search(request: HttpRequest, q: str):  # pyright: ignore[reportUnusedParameter]
    quiblets = Quiblet.objects.filter(name__istartswith=q)
    quiblets = Quiblet.objects.filter(name__istartswith=q)
    # profiles = Profile.objects.filter(username__istartswith=q)
    # TODO: Implement user search via Auth Service if needed

    return {"quiblets": quiblets, "profiles": []}


# --------------------
# Feed Routes
# --------------------


@router.get("/feed", response=list[QuibSchema])
@paginate
def get_feed(request: CustomHttpRequest):
    return Quib.objects.published().for_request(request).select_related("quiblet")
