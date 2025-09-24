from django.http import HttpRequest
from ninja import Router

router = Router()

@router.get("/is-unique-name")
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    if not name:
        return False

    # implement real checking here
    # mock response for now
    return True
