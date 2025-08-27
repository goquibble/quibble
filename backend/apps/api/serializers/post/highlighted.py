from apps.post.models import Post
from rest_framework import serializers


class PostHighlightedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("cover", "title", "id", "slug", "created_at")
