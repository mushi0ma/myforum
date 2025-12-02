from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ForumPost, ForumComment, PostVote
from .serializers import ForumPostSerializer, ForumCommentSerializer

class ForumPostViewSet(viewsets.ModelViewSet):
    """
    API для форума. Поддерживает поиск и фильтрацию.
    """
    queryset = ForumPost.objects.all().order_by('-created_at')
    serializer_class = ForumPostSerializer
    # Разрешаем чтение всем, изменение - только авторизованным (пока AllowAny для теста)
    permission_classes = [permissions.AllowAny] 
    
    # Включаем поиск
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'code_snippet']
    ordering_fields = ['created_at', 'views']

    def perform_create(self, serializer):
        # Автоматически проставляем автора, если юзер залогинен
        # Если нет - то пока admin (для теста), в проде убрать!
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(author=user)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """Лайкнуть пост"""
        post = self.get_object()
        # Логика лайка (упрощенная)
        # В реальности тут нужно брать request.user
        return Response({'status': 'liked (stub)'})

class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.all()
    serializer_class = ForumCommentSerializer
    permission_classes = [permissions.AllowAny]