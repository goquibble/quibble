from http import HTTPMethod
from typing import cast

from apps.api.http import HttpRequest
from apps.api.serializers.community import (
    CommunityBasicSerializer,
    CommunityDetailedSerializer,
    CommunityExistsSerializer,
    CommunitySerializer,
)
from apps.api.serializers.post import PostSerializer
from apps.api.serializers.post.highlighted import PostHighlightedSerializer
from apps.community.filters import CommunityFilter
from apps.community.models import Community
from django.db.models import QuerySet
from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema
from rest_framework import exceptions, response, viewsets
from rest_framework.decorators import action


@extend_schema(tags=["communities & topics"])
class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    # default serializer
    serializer_class = CommunitySerializer
    lookup_field = "name"
    # filter
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = CommunityFilter

    # extra custom serializers
    serializer_classes = {
        "list": CommunityBasicSerializer,
        "retrieve": CommunityDetailedSerializer,
        # extra actions
        "exists": CommunityExistsSerializer,
        "posts": PostSerializer,
        "highlighted_posts": PostHighlightedSerializer,
    }

    def get_queryset(self) -> QuerySet[Community]:  # pyright: ignore
        return super().get_queryset()

    def get_object(self) -> Community:  # pyright: ignore
        qs = self.get_queryset()
        filter_kwargs = {f"{self.lookup_field}__iexact": self.kwargs[self.lookup_field]}
        obj = qs.filter(**filter_kwargs).first()

        if not obj:
            raise exceptions.NotFound(
                f"Community with name q/{self.kwargs[self.lookup_field]} not found."
            )
        return obj

    def get_serializer_class(self):  # pyright: ignore
        if self.action in self.serializer_classes:
            return self.serializer_classes[self.action]
        return self.serializer_class

    @action(detail=True, methods=[HTTPMethod.GET])
    def exists(self, request, name=None):
        res = dict(exists=False, name=name)

        community = self.get_queryset().filter(name__iexact=name).first()
        if community is not None:
            res["exists"] = True
            res["name"] = community.name

        return response.Response(res)

    @extend_schema(responses=PostSerializer(many=True))
    @action(detail=True, methods=[HTTPMethod.GET])
    def posts(self, request, name=None):
        posts = self.get_object().posts.all()  # pyright: ignore
        serializer = PostSerializer(posts, many=True, context={"request": request})

        return response.Response(serializer.data)

    @extend_schema(responses=PostHighlightedSerializer(many=True))
    @action(detail=True, methods=[HTTPMethod.GET], url_path="highlighted-posts")
    def highlighted_posts(self, request, name=None):
        posts = self.get_object().posts.filter(highlighted=True)  # pyright: ignore
        serializer = PostHighlightedSerializer(
            posts, many=True, context={"request": request}
        )

        return response.Response(serializer.data)

    def perform_create(self, serializer):
        patched_request = cast(HttpRequest, self.request)

        creator = patched_request.user_profile
        # add creator as member and ranger of the community
        community: Community = serializer.save()
        community.members.add(creator)
        community.moderators.add(creator)
