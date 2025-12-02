from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, ForumCommentViewSet

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet)
router.register(r'comments', ForumCommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]