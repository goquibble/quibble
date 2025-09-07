from django.contrib import admin
from django.urls import include, path

from api.urls import api_v1

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", api_v1.urls),
    # django-allauth urls and headless apis
    path("accounts/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
]
