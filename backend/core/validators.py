from django.core.validators import RegexValidator
from django.utils.deconstruct import deconstructible


@deconstructible
class UsernameValidator(RegexValidator):
    regex = r"^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$"
    message = "Only letters, numbers, _ and -, no special characters at the ends."
    flags = 0
