# pyright: reportUninitializedInstanceVariable=false
from uuid import UUID
from django.http import HttpRequest
from core.services.auth import User


class CustomHttpRequest(HttpRequest):
    user_id: UUID
    auth_user: User
