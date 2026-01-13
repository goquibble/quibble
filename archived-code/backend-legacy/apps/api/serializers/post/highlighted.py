from rest_framework import serializers

from apps.post.models import Post


class PostHighlightedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("cover", "title", "id", "slug", "created_at")
