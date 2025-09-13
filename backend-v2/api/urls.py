from django.http import HttpRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import NinjaAPI
from ninja.responses import Response

from .views.user import router as user_router

api_v1 = NinjaAPI(version="v1")
api_v1.add_router("/user", user_router)


@api_v1.get("/csrf-token")
@ensure_csrf_cookie
def healthcheck(request: HttpRequest): # pyright: ignore[reportUnusedParameter]
    return Response({"success": True})
