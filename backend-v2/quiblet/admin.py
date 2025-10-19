# pyright: reportMissingTypeArgument=false
from django.contrib import admin

from quiblet.models import Comment, Quib, QuibVote, Quiblet, QuibletMember

# --------------------
# Quiblet Admin
# --------------------


@admin.register(Quiblet)
class QuibletAdmin(admin.ModelAdmin):
    list_display = ["name", "type", "nsfw", "created_at"]
    search_fields = ["name"]


@admin.register(QuibletMember)
class QuibletMemberAdmin(admin.ModelAdmin):
    list_display = ["quiblet", "member", "is_moderator"]


# --------------------
# Quib Admin
# --------------------


@admin.register(Quib)
class QuibAdmin(admin.ModelAdmin):
    list_display = ["title", "quiblet", "poster", "is_published", "created_at"]
    search_fields = ["title", "quiblet__name", "poster__name"]


@admin.register(QuibVote)
class QuibVoteAdmin(admin.ModelAdmin):
    list_display = ["quib", "voter", "value"]


# --------------------
# Comment Admin
# --------------------


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["quib", "commenter", "path", "is_deleted"]
