from django.http import HttpRequest
from ninja import NinjaAPI

api_v1 = NinjaAPI(version="v1")


@api_v1.get("/healthcheck")
def healthcheck(request: HttpRequest):  # pyright: ignore[reportUnusedParameter]
    return True
