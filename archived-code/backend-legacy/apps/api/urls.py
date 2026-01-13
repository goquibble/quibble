from django.urls import include, path
from rest_framework import routers

from .views.user import MeAPIView, MeProfileAPIView
from .views.user.auth import GoogleLogin, LogoutAPIView, SelectProfileAPIView
from .viewsets.comment import CommentViewSet
from .viewsets.community import CommunityViewSet
from .viewsets.community.topics import TopicViewSet
from .viewsets.post import PostViewSet
from .viewsets.user import MyProfilesViewSet, ProfileViewSet

main_router = routers.DefaultRouter()
main_router.register(r"comments", CommentViewSet, basename="comments")
main_router.register(r"posts", PostViewSet, basename="posts")
main_router.register(r"q/communities", CommunityViewSet, basename="communities")
main_router.register(r"q/topics", TopicViewSet, basename="topics")
# user routes
user_router = routers.DefaultRouter()
user_router.register(r"u/profiles", ProfileViewSet, basename="profiles")
user_router.register(r"u/me/profiles", MyProfilesViewSet, basename="me-profiles")

# https://stackoverflow.com/a/65186703
main_router.registry.extend(user_router.registry)

# fmt: off
urlpatterns = [
    path('u/me/', MeAPIView.as_view(), name='me'),
    path('u/me/profile/', MeProfileAPIView.as_view(), name='me-profile'),
    # auth endpoints
    # custom logout endpoint (must come before dj_rest_auth.urls)
    path('auth/logout/', LogoutAPIView.as_view(), name='rest_logout'),
    path('auth/select/<int:profile_id>/', SelectProfileAPIView.as_view(), name='select-profile-id'),
    # dj_rest_auth.urls (default endpoints)
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('django.contrib.auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    # social
    path('auth/google/', GoogleLogin.as_view(), name='google-login')
]
# fmt: on

# router urls should be placed last to prevent overriding
urlpatterns += main_router.urls
