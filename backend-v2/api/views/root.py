from django.http import HttpRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router

from api.schemas.root import SearchSchema
from quiblet.models import Quiblet
from user.models import Profile

router = Router()


# --------------------
# Auth Related Routes
# --------------------


@router.get("/csrf-token")
@ensure_csrf_cookie
def healthcheck(request: HttpRequest):
    _ = request
    return {"success": True}


# --------------------
# Search Routes
# --------------------


@router.get("/search", response=SearchSchema)
def search(request: HttpRequest, q: str):
    _ = request
    quiblets = Quiblet.objects.filter(name__istartswith=q)
    profiles = Profile.objects.filter(username__istartswith=q)

    return {"quiblets": quiblets, "profiles": profiles}
