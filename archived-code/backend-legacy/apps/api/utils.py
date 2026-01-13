from dj_rest_auth.jwt_auth import unset_jwt_cookies
from rest_framework.response import Response


def unset_jwt_cookies_with_profile_id(response: Response):
    # delete profile-id cookie
    response.delete_cookie("profile-id")
    # delete rest of jwt related cookies
    unset_jwt_cookies(response)
