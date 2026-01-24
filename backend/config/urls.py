from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from api.urls import api_v1

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", api_v1.urls),
]

# development only configs
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
