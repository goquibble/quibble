from typing import Any


def get_avatar_upload_path(instance: Any, filename: str) -> str:
    indentifier = "q"
    if hasattr(instance, "username"):
        # if this is a Profile model
        indentifier = "u"

    extension = filename.split(".")[-1]
    extension = "webp"
    return f"avatars/{indentifier}_{instance.username}.{extension}"
