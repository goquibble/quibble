from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers


class DetailResponseSerializer(serializers.Serializer):
    """
    Serializer for a response containing a `"detail"` message.
    Used for generic informational responses.
    """

    detail = serializers.CharField()


class SuccessResponseSerializer(serializers.Serializer):
    """
    Serializer for a response with a `"success"` boolean.
    Typically used for confirming successful operations.
    """

    success = serializers.BooleanField()


class ReactionSerializer(serializers.Serializer):
    """
    Serializer for reactions.
    Used for posts/comments/etc...
    """

    action = serializers.CharField()

    def validate_action(self, value):
        if value not in ["upvote", "downvote"]:
            raise serializers.ValidationError(f"Invalid action: {value}")
        return value


class BaseRatioModelSerializer(serializers.ModelSerializer):
    """
    Base serializer for instances with ratio.
    Checks if it has annotated ratio or not, then proceeds to return default value!
    """

    ratio = serializers.SerializerMethodField()

    @extend_schema_field(OpenApiTypes.INT)
    def get_ratio(self, obj):
        if hasattr(obj, "ratio"):
            return obj.ratio
        return 0  # default value for new instances
