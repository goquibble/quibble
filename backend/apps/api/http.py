from typing import Optional, Union

from apps.user.models import Profile, User
from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest as DjangoHttpRequest


class HttpRequest(DjangoHttpRequest):
    """
    Patched version of native HttpRequest with extra types.
    """

    user: Union[User, AnonymousUser]  # pyright: ignore
    user_profile: Optional[Profile]
