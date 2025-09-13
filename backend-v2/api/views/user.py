from django.http import HttpRequest
from ninja import Router

from api.auth import ProfileAuth

router = Router()

@router.get("/pfs", auth=ProfileAuth())
def get_requested_user_profiles(request: HttpRequest):
    print(request.user)
    # print(request.headers.get(""))
    return {"success": True}
