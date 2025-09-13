from typing import cast
from django.http import HttpRequest
from user.models import Profile, CustomUser

class CustomHttpRequest(HttpRequest):
    user_p: Profile | None = None

    @property
    def custom_user(self):
        return cast(CustomUser, self.user)
