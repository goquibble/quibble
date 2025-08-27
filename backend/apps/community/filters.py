from django_filters import rest_framework as filters

from .models import Community


class CommunityFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="istartswith")

    class Meta:
        model = Community
        fields = ("name",)
