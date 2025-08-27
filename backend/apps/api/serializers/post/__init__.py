from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.api.bases.serializers import BaseRatioModelSerializer
from apps.api.serializers.community import CommunityBasicSerializer
from apps.api.serializers.user.profile import ProfileBasicSerializer
from apps.post.models import Post


class PostSerializer(BaseRatioModelSerializer):
    community = CommunityBasicSerializer(read_only=True)
    poster = ProfileBasicSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"

    @extend_schema_field(OpenApiTypes.INT)
    def get_comment_count(self, obj):
        if hasattr(obj, "comment_count"):
            return obj.comment_count
        return 0  # default value for new posts


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("community", "poster", "title", "content", "cover")

    def create(self, validated_data):
        poster = self.context["request"].user_profile
        post = Post.objects.create(**validated_data)

        post.upvotes.add(poster)

        return post
