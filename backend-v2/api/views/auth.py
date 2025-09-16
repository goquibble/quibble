# pyright: reportMissingTypeStubs=false
from typing import Any, override
from allauth.headless.account.views import SessionView
from allauth.headless.adapter import get_adapter as get_account_adapter
from allauth.headless.base.response import AuthenticationResponse
from django.http import HttpRequest


class CustomSessionView(SessionView):
    @override
    def delete(self, request: HttpRequest, *args: Any, **kwargs: Any):
        adapter = get_account_adapter()
        adapter.logout(request)

        response = AuthenticationResponse(request)
        response.delete_cookie("profile_id")
        return response
