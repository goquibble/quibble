from rest_framework import status
from rest_framework.exceptions import APIException


class ServerError(APIException):
    """Custom API exception error with 500 status code"""

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "An unexpected server error occurred."
    default_code = "server_error"
