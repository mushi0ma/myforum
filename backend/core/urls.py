from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RepositoryViewSet, 
    CommitViewSet, 
    GenerateCommitMessageView, 
    AISmartReviewView
)

# Создаем роутер
router = DefaultRouter()
router.register(r'repos', RepositoryViewSet, basename='repositories')
router.register(r'commits', CommitViewSet, basename='commits')

urlpatterns = [
    # ВАЖНО: Сначала конкретные пути
    path('tools/generate-commit/', GenerateCommitMessageView.as_view(), name='ai_commit'),
    path('tools/code-review/', AISmartReviewView.as_view(), name='ai_code_review'),

    # Потом роутер (он ловит всё остальное)
    path('', include(router.urls)),
]