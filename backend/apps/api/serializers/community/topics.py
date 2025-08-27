from rest_framework import serializers

from apps.community.models import Topic


class TopicSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ("id", "display_name", "icon", "sensitivity", "children")

    def get_children(self, obj) -> dict:
        return TopicSerializer(obj.children.all(), many=True).data
