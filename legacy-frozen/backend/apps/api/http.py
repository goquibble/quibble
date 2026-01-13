from typing import Optional, Union

from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest as DjangoHttpRequest

from apps.user.models import Profile, User


class HttpRequest(DjangoHttpRequest):
    """
    Patched version of native HttpRequest with extra types.
    """

    user: Union[User, AnonymousUser]  # pyright: ignore
    user_profile: Optional[Profile]
