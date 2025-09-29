from django.contrib import admin

from .models import Quib


@admin.register(Quib)
class PostAdmin(admin.ModelAdmin):  # pyright: ignore [reportMissingTypeArgument]
    list_display = ("title", "quiblet", "poster", "is_published", "created_at")
    search_fields = ("title", "quiblet__name", "poster__name")
