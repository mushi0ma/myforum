from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ForumPost, ForumComment, PostVote, Notification, SavedForumPost
from .serializers import ForumPostSerializer, ForumCommentSerializer, NotificationSerializer, SavedForumPostSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """Пометить уведомление как прочитанное"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Получить количество непрочитанных уведомлений"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})

class ForumPostViewSet(viewsets.ModelViewSet):
    """
    API для форума. Поддерживает поиск, фильтрацию и сортировку.

    Query params:
    - search: поиск по title, description, code_snippet
    - ordering: сортировка (trending_score, created_at, views)
    - language: фильтр по языку программирования
    - tags: фильтр по тегам (через django-taggit)
    """
    queryset = ForumPost.objects.all().order_by('-created_at')
    serializer_class = ForumPostSerializer
    # Разрешаем чтение всем, изменение - только авторизованным (пока AllowAny для теста)
    permission_classes = [permissions.AllowAny]

    # Включаем поиск и сортировку
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'code_snippet']
    ordering_fields = ['created_at', 'views', 'trending_score', 'forks_count']

    def get_queryset(self):
        """
        Фильтрация по language и tags.
        Examples:
        - /api/posts/?language=Python
        - /api/posts/?tags=react,hooks
        - /api/posts/?ordering=-trending_score
        """
        queryset = super().get_queryset()

        # Фильтр по языку программирования
        language = self.request.query_params.get('language')
        if language and language != 'All':
            queryset = queryset.filter(language=language)

        # Фильтр по тегам (через django-taggit)
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                queryset = queryset.filter(tags__name__in=[tag])

        return queryset

    def perform_create(self, serializer):
        # Автоматически проставляем автора, если юзер залогинен
        # Если нет - то пока admin (для теста), в проде убрать!
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(author=user)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """Лайкнуть пост"""
        post = self.get_object()
        user = request.user if request.user.is_authenticated else None

        if user:
            vote, created = PostVote.objects.get_or_create(
                post=post,
                user=user,
                defaults={'vote_type': 'like'}
            )
            if not created:
                vote.delete()
                return Response({'status': 'unliked', 'likes_count': post.votes.filter(vote_type='like').count()})

        return Response({'status': 'liked', 'likes_count': post.votes.filter(vote_type='like').count()})

    @action(detail=True, methods=['post'])
    def fork(self, request, pk=None):
        """Форкнуть пост (создать копию)"""
        original = self.get_object()
        user = request.user if request.user.is_authenticated else None

        # Создаем копию поста
        forked_post = ForumPost.objects.create(
            author=user,
            title=f"{original.title} (Fork)",
            description=original.description,
            code_snippet=original.code_snippet,
            language=original.language,
        )

        # Увеличиваем счетчик форков оригинала
        original.forks_count += 1
        original.save(update_fields=['forks_count'])

        serializer = self.get_serializer(forked_post)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def save_post(self, request, pk=None):
        """Добавить/удалить пост из закладок (toggle)"""
        post = self.get_object()
        user = request.user

        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        saved, created = SavedForumPost.objects.get_or_create(user=user, post=post)
        if not created:
            saved.delete()
            return Response({'status': 'unsaved', 'is_saved': False})

        return Response({'status': 'saved', 'is_saved': True})

class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.all()
    serializer_class = ForumCommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Фильтрация по post_id"""
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(author=user)


class SavedForumPostViewSet(viewsets.ModelViewSet):
    """
    API для закладок (Bookmarks).

    GET /api/forum/bookmarks/ - получить список закладок пользователя
    POST /api/forum/bookmarks/ - добавить пост в закладки (body: {post_id: 1})
    DELETE /api/forum/bookmarks/{id}/ - удалить закладку
    """
    serializer_class = SavedForumPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Возвращает только закладки текущего пользователя"""
        return SavedForumPost.objects.filter(user=self.request.user).select_related('post', 'post__author')

    def perform_create(self, serializer):
        """Автоматически присваиваем текущего пользователя"""
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Создание закладки с проверкой на дубликат"""
        post_id = request.data.get('post_id')
        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Проверяем, не сохранен ли уже
        existing = SavedForumPost.objects.filter(user=request.user, post_id=post_id).first()
        if existing:
            return Response({'error': 'Post already saved', 'id': existing.id}, status=status.HTTP_409_CONFLICT)

        return super().create(request, *args, **kwargs)