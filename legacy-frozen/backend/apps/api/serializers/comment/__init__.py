from django.shortcuts import get_object_or_404
from rest_framework import serializers

from apps.api.bases.serializers import BaseRatioModelSerializer
from apps.api.serializers.user.profile import ProfileBasicSerializer
from apps.comment.models import Comment
from apps.post.models import Post


class CommentSerializer(BaseRatioModelSerializer):
    commenter = ProfileBasicSerializer(allow_null=True)

    class Meta:
        model = Comment
        fields = "__all__"


class CommentOverviewSerializer(CommentSerializer):
    commenter = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    reply_to = serializers.SerializerMethodField()
    is_op = serializers.SerializerMethodField()

    class Meta(CommentSerializer.Meta):
        fields = (
            "id",
            "commenter",
            "reply_to",
            "is_op",
            "ratio",
            "post",
            "created_at",
            "content",
            "upvotes",
            "downvotes",
        )

    def get_commenter(self, obj):
        return obj.commenter.username

    def get_post(self, obj):
        request = self.context.get("request")

        if post := Post.objects.filter(comments=obj).first():
            return {
                "id": post.pk,
                "title": post.title,
                "slug": post.slug,
                "community": {
                    "name": post.community.name,
                    "avatar": (
                        request.build_absolute_uri(post.community.avatar.url)
                        if post.community.avatar
                        else None
                    ),
                },
            }
        return None

    def get_reply_to(self, obj):
        if parent := obj.parent():
            return parent.commenter.username
        return None

    def get_is_op(self, obj):
        post = Post.objects.filter(comments=obj).first()
        if post and post.poster == obj.commenter:
            return True
        return False


class CommentCreateSerializer(serializers.ModelSerializer):
    path = serializers.CharField(required=False)

    class Meta:
        model = Comment
        fields = ("path", "content", "post")
        extra_kwargs = {"post": {"write_only": True}}

    def create(self, validated_data):
        data = {
            "commenter": self.context["request"].user_profile,
            "content": validated_data["content"],
            "post": validated_data["post"],
        }

        if path := validated_data.get("path"):
            parent_instance = get_object_or_404(Comment, path__match=path)
            comment_instance: Comment = Comment.objects.create_child(  # pyright: ignore
                parent=parent_instance, **data
            )
        else:
            comment_instance: Comment = Comment.objects.create_child(
                **data
            )  # pyright: ignore

        comment_instance.upvotes.add(data["commenter"])
        return comment_instance
