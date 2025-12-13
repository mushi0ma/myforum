from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, ForumCommentViewSet, NotificationViewSet, SavedForumPostViewSet

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet)
router.register(r'comments', ForumCommentViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'bookmarks', SavedForumPostViewSet, basename='bookmark')

urlpatterns = [
    path('', include(router.urls)),
    path('accounts/', include('allauth.urls')),
]