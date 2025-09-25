from typing import Any


def get_avatar_upload_path(instance: Any, filename: str) -> str:
    """
    Helper function which returns upload path for avatars.
    Checks if passed Instance is Profile or Quiblet model and adjust accordingly.
    """
    indentifier = "q"
    if hasattr(instance, "username"):  # if this is a Profile model
        indentifier = "u"

    extension = filename.split(".")[-1]
    extension = "webp"
    return f"avatars/{indentifier}_{instance.username}.{extension}"


def get_banner_upload_path(instance: Any, filename: str) -> str:
    """
    Helper function which returns upload path for banners.
    Checks if passed Instance is Profile or Quiblet model and adjust accordingly.
    """
    indentifier = "q"
    if hasattr(instance, "username"):  # if this is a Profile model
        indentifier = "u"

    extension = filename.split(".")[-1]
    extension = "webp"
    return f"banners/{indentifier}_{instance.username}.{extension}"
