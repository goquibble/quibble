from ninja import Router
from ninja.security import SessionAuth

from api.auth import ProfileAuth
from api.http import CustomHttpRequest
from api.schemas.user import ProfileSchema

router = Router()


@router.get("/me/profiles", auth=SessionAuth(), response=list[ProfileSchema])
def get_my_profiles(request: CustomHttpRequest):
    return request.custom_user.profiles.all()


@router.get("/me/profile", auth=ProfileAuth(), response=ProfileSchema)
def get_my_profile(request: CustomHttpRequest):
    return request.user_p
