# pyright: reportUninitializedInstanceVariable=false
from typing import cast
from django.http import HttpRequest
from user.models import Profile, CustomUser


class CustomHttpRequest(HttpRequest):
    user_p: Profile
    _custom_user: CustomUser

    @property
    def custom_user(self):
        self._custom_user = cast(CustomUser, self.user)
        return self._custom_user

    @custom_user.setter
    def custom_user(self, value: CustomUser):
        self._custom_user = value
