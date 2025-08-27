from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

from apps.api.serializers.community.topics import TopicSerializer
from apps.community.models import Topic


@extend_schema(tags=["communities & topics"])
class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.filter(parent__isnull=True)
    serializer_class = TopicSerializer
