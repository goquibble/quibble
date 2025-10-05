from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router

from api.schemas.root import SearchSchema
from api.shared.schemas import SuccessResponseSchema
from quiblet.models import Quiblet
from user.models import Profile

router = Router()


# --------------------
# Auth Related Routes
# --------------------


@router.get("/csrftoken", response=SuccessResponseSchema)
@ensure_csrf_cookie
def set_csrftoken(request: HttpRequest):
    _ = request
    return JsonResponse({"success": True})


# --------------------
# Search Routes
# --------------------


@router.get("/search", response=SearchSchema)
def search(request: HttpRequest, q: str):
    _ = request
    quiblets = Quiblet.objects.filter(name__istartswith=q)
    profiles = Profile.objects.filter(username__istartswith=q)

    return {"quiblets": quiblets, "profiles": profiles}
