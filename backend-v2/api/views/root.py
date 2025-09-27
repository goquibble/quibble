from django.http import HttpRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router

from api.schemas.root import SearchSchema
from quiblet.models import Quiblet
from user.models import Profile

router = Router()


@router.get("/csrf-token")
@ensure_csrf_cookie
def healthcheck(request: HttpRequest):
    _ = request
    return {"success": True}


@router.get("/search", response=SearchSchema)
def search(request: HttpRequest, query: str):
    _ = request
    quiblets = Quiblet.objects.filter(name__istartswith=query)
    profiles = Profile.objects.filter(username__istartswith=query)

    return {"quiblets": quiblets, "profiles": profiles}
