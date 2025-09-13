from ninja import Router

from api.auth import ProfileAuth
from api.http import CustomHttpRequest

router = Router()

@router.get("/profiles", auth=ProfileAuth())
def get_requested_user_profiles(request: CustomHttpRequest):
    print(request.user_p)
    return {"success": True}
