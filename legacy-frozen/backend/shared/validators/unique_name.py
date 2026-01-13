from django.core.validators import RegexValidator
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class UniqueNameValidator(RegexValidator):
    regex = r"^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$"
    message = _("Only letters, numbers, _ and -, no special characters at the ends.")
    flags = 0
