# pyright: reportMissingTypeArgument=false
from django.contrib import admin

from quiblet.models import Quib, QuibVote, Quiblet


@admin.register(Quiblet)
class QuibletAdmin(admin.ModelAdmin):
    list_display = ["name", "type", "nsfw", "created_at"]
    search_fields = ["name"]


@admin.register(Quib)
class QuibAdmin(admin.ModelAdmin):
    list_display = ["title", "quiblet", "poster", "is_published", "created_at"]
    search_fields = ["title", "quiblet__name", "poster__name"]


@admin.register(QuibVote)
class QuibVoteAdmin(admin.ModelAdmin):
    list_display = ["quib", "voter", "value"]
