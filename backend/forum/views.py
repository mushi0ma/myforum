from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ForumPost, ForumComment, PostVote
from .serializers import ForumPostSerializer, ForumCommentSerializer

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