from http import HTTPMethod

from apps.api.bases.serializers import ReactionSerializer
from apps.api.serializers.comment import CommentCreateSerializer, CommentSerializer
from apps.api.serializers.post import PostCreateSerializer, PostSerializer
from apps.post.models import Post
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import exceptions, response, status, viewsets
from rest_framework.decorators import action
from shared.mixins.api.reaction import ReactionMixin


class PostViewSet(ReactionMixin, viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    serializer_mapping = {
        "create": PostCreateSerializer,
        "comments": CommentCreateSerializer,
        "reaction": ReactionSerializer,
    }

    def get_serializer_class(self):  # pyright: ignore
        return self.serializer_mapping.get(self.action, self.serializer_class)

    def get_queryset(self):
        queryset = super().get_queryset()
        sort_param = self.request.query_params.get("sort")

        if sort_param == "hot":
            return Post.objects.hot()
        elif sort_param == "best":
            return Post.objects.best()
        elif sort_param == "new":
            return Post.objects.new()
        elif sort_param == "top":
            return Post.objects.top()

        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="sort",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Sort posts by: hot, best, new, top",
                enum=["hot", "best", "new", "top"],
                required=False,
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(responses=PostSerializer)
    def create(self, request):
        context = {"request": request}

        serializer = PostCreateSerializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        post_instance = serializer.save()

        response_serializer = PostSerializer(post_instance, context=context)
        return response.Response(
            response_serializer.data, status=status.HTTP_201_CREATED
        )

    @extend_schema(
        methods=["GET"],
        responses=CommentSerializer(many=True),
    )
    @extend_schema(
        methods=["POST"],
        responses=CommentSerializer,
    )
    @action(detail=True, methods=[HTTPMethod.GET, HTTPMethod.POST])
    def comments(self, request, pk=None):
        if request.method == HTTPMethod.POST and not request.user.is_authenticated:
            raise exceptions.NotAuthenticated()

        post_instance = self.get_object()

        context = {"request": request}

        if request.method == HTTPMethod.GET:
            comments = post_instance.comments.all()  # pyright: ignore
            serializer = CommentSerializer(comments, many=True, context=context)

            return response.Response(serializer.data, status=status.HTTP_200_OK)

        # POST request
        request.data["post"] = post_instance.id
        serializer = CommentCreateSerializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)

        comment_instance = serializer.save()

        response_serializer = CommentSerializer(comment_instance, context=context)
        return response.Response(
            response_serializer.data, status=status.HTTP_201_CREATED
        )
