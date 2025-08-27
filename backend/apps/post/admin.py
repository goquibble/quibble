from django.contrib import admin

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "community", "poster", "type", "created_at")
    search_fields = ("title", "community__name", "poster__name")
