import copy

from rest_framework import serializers

from apps.api.serializers.comment import CommentSerializer
from apps.api.serializers.post import PostSerializer


class DownvotedSerializer(serializers.Serializer):
    content_type = serializers.CharField()
    content = serializers.SerializerMethodField()

    def get_content(self, obj) -> dict:
        obj_type = obj.content_type
        obj_copy = copy.copy(obj)

        delattr(obj_copy, "content_type")

        if obj_type == "post":
            return PostSerializer(obj_copy, context=self.context).data
        return CommentSerializer(obj_copy, context=self.context).data
