from ninja import Router
from ninja.security import SessionAuth

from api.http import CustomHttpRequest
from api.schemas.user import ProfileOutSchema

router = Router()


@router.get("/profiles", auth=SessionAuth(), response=list[ProfileOutSchema])
def get_requested_user_profiles(request: CustomHttpRequest):
    return request.custom_user.profiles.all()
