from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularJSONAPIView,
    SpectacularSwaggerView,
)

# modify adminsite
admin.site.site_header = "Quibble Administration"
admin.site.index_title = "Apps and Services"
admin.site.site_title = "Quibble"

urlpatterns = [
    # admin
    path("admin/", admin.site.urls),
    # v1
    path("api/v1/", include("apps.api.urls")),
    # openapi(v1)
    path("api/v1/schema/", SpectacularAPIView.as_view(api_version="v1"), name="schema"),
    path("api/v1/schema.json", SpectacularJSONAPIView.as_view(), name="schema-json"),
]

# only add swagger ui for development
if settings.DEBUG:
    urlpatterns += [
        path(
            "api/v1/schema/swagger/", SpectacularSwaggerView.as_view(), name="swagger"
        ),
        path("silk/", include("silk.urls", namespace="silk")),
    ]

# https://docs.djangoproject.com/en/2.1/howto/static-files/#serving-static-files-during-development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
