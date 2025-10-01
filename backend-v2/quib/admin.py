from django.contrib import admin

from .models import Quib, QuibVote


@admin.register(Quib)
class QuibAdmin(admin.ModelAdmin):  # pyright: ignore [reportMissingTypeArgument]
    list_display = ["title", "quiblet", "poster", "is_published", "created_at"]
    search_fields = ["title", "quiblet__name", "poster__name"]


@admin.register(QuibVote)
class QuibVoteAdmin(admin.ModelAdmin):  # pyright: ignore [reportMissingTypeArgument]
    list_display = ["quib", "voter", "value"]
