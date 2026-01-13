from typing import Any


def get_avatar_upload_path(instance: Any, _filename: str) -> str:
    return get_upload_path(instance, "avatars")


def get_banner_upload_path(instance: Any, _filename: str) -> str:
    return get_upload_path(instance, "banners")


def get_upload_path(instance: Any, folder: str) -> str:
    """
    Generic helper function returning upload path.
    Determines if instance is Profile or Quiblet based on attribute presence, then constructs path.
    """
    if hasattr(instance, "username"):  # Profile model
        identifier = "u"
        unique_file_name = instance.username
    else:  # Quiblet model
        identifier = "q"
        unique_file_name = instance.name

    extension = "webp"
    return f"{folder}/{identifier}-{unique_file_name}.{extension}"
