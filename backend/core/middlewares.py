from django.utils.deprecation import MiddlewareMixin
from api.http import CustomHttpRequest
from user.models import CustomUser


class CustomUserMiddleware(MiddlewareMixin):
    def process_request(self, request: CustomHttpRequest):
        # Middleware to attach a typed 'custom_user' attribute to the request object.
        # This ensures that views can safely access 'request.custom_user' as a CustomUser instance,
        if hasattr(request, "user") and isinstance(request.user, CustomUser):
            request.custom_user = request.user
