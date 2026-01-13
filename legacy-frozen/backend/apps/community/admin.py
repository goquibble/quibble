from django.contrib import admin

from .models import Community, Topic


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("display_name", "icon", "sensitivity")
    list_filter = ("sensitivity",)
    search_fields = ("display_name",)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "parent":
            kwargs["queryset"] = Topic.objects.filter(parent__isnull=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "nsfw", "created_at")
    search_fields = ("name",)
