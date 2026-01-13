from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("commenter", "content", "created_at", "deleted")
    search_fields = ("commenter__username", "content")
