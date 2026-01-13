# pyright: reportMissingTypeArgument=false
from django.contrib import admin

from user.models import CustomUser, Profile

# --------------------
# User Admin
# --------------------


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    readonly_fields = ("date_joined",)
    list_display = ("email", "is_active", "is_staff", "is_superuser", "date_joined")
    search_fields = ("email",)
    ordering = ("email",)


# --------------------
# Profile Admin
# --------------------


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "user__email", "name", "created_at")
    search_fields = ("username", "user__email")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
