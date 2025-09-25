from django.contrib import admin

from quiblet.models import Quiblet


@admin.register(Quiblet)
class QuibletAdmin(admin.ModelAdmin):  # pyright: ignore [reportMissingTypeArgument]
    list_display = ("name", "type", "nsfw", "created_at")
    search_fields = ("name",)
