from http import HTTPMethod
from typing import cast

from drf_spectacular.utils import extend_schema
from rest_framework import exceptions, response
from rest_framework.decorators import action

from apps.api.bases.serializers import SuccessResponseSerializer
from apps.api.http import HttpRequest


class ReactionMixin:
    """
    API viewset mixin to add `reaction` endpoint.
    Includes `/reaction` action.
    """

    @extend_schema(responses=SuccessResponseSerializer)
    @action(detail=True, methods=[HTTPMethod.PATCH])
    def reaction(self, request, pk=None):
        """
        This endpoint allows a user to either upvote or downvote a model.

        Request Body:
        - `action` (str): Either `"upvote"` or `"downvote"`.

        Responses:
        - `200 OK`: Reaction applied successfully. Returns `{"success": True}`.
        - `400 Bad Request`: If the user has already applied the same reaction or an invalid action is provided.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data["action"]

        obj = self.get_object()
        req_user = cast(HttpRequest, self.request).user_profile

        if not req_user:
            raise exceptions.NotAuthenticated()

        if action == "upvote":
            if req_user and obj.upvotes.filter(pk=req_user.pk).exists():
                obj.upvotes.remove(req_user)
                return response.Response({"success": True})

            obj.downvotes.remove(req_user)
            obj.upvotes.add(req_user)
        elif action == "downvote":
            if obj.downvotes.filter(pk=req_user.pk).exists():
                obj.downvotes.remove(req_user)
                return response.Response({"success": True})

            obj.upvotes.remove(req_user)
            obj.downvotes.add(req_user)

        return response.Response({"success": True})
