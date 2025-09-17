from typing import Callable, cast
from allauth.headless.constants import Client
from django.contrib import admin
from django.http import HttpRequest, HttpResponse
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from api.urls import api_v1
from api.views.auth import CustomSessionView

custom_session_view = cast(
    Callable[[HttpRequest], HttpResponse],
    CustomSessionView.as_api_view(client=Client.BROWSER),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", api_v1.urls),
    # django-allauth urls and headless apis
    path("accounts/", include("allauth.urls")),
    path("_allauth/browser/v1/auth/session", custom_session_view),
    path("_allauth/", include("allauth.headless.urls")),
]

# development only configs
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
