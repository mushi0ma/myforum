from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from taggit.managers import TaggableManager
# from core.models import Repositories # Если захотим привязывать обсуждения к репозиториям

class ForumPost(models.Model):
    """
    Посты на форуме (вопросы, обсуждения).
    Отличаются от Issues тем, что не привязаны жестко к багам репозитория.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_posts')
    title = models.CharField(max_length=200)
    description = models.TextField(help_text="Описание вопроса или темы")

    # Сниппет кода в посте (партнер предлагал это, оставим, полезно для IT форума)
    code_snippet = models.TextField(blank=True, null=True, help_text="Кусок кода для обсуждения")
    language = models.CharField(max_length=50, default='text', help_text="Язык программирования")

    views = models.IntegerField(default=0)
    forks_count = models.IntegerField(default=0, help_text="Количество форков поста")
    is_solved = models.BooleanField(default=False) # Галочка "Ответ найден"

    # Trending score для алгоритма трендов
    trending_score = models.FloatField(default=0.0, db_index=True, help_text="Engagement velocity score")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tags = TaggableManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Forum Post"
        verbose_name_plural = "Forum Posts"

    def __str__(self):
        return self.title

    def calculate_trending_score(self):
        """
        Вычисляет trending score по формуле:
        score = (likes + comments*2 + forks*3) / hours^1.5

        Алгоритм основан на engagement velocity - как быстро пост набирает активность.
        """
        # Подсчет метрик
        likes_count = self.votes.filter(vote_type='like').count()
        comments_count = self.comments.count()
        forks = self.forks_count

        # Вычисляем количество часов с момента создания
        time_diff = timezone.now() - self.created_at
        hours = time_diff.total_seconds() / 3600

        # Избегаем деления на ноль/очень маленькое число (минимум 0.1 часа = 6 минут)
        hours = max(hours, 0.1)

        # Формула trending score
        engagement = likes_count + (comments_count * 2) + (forks * 3)
        score = engagement / (hours ** 1.5)

        return round(score, 2)

    def save(self, *args, **kwargs):
        """
        Сохранение поста.
        Trending score пересчитывается периодически через Celery Beat (каждые 15 минут).
        """
        super().save(*args, **kwargs)

class ForumComment(models.Model):
    """Комментарии к постам форума"""
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'

class PostVote(models.Model):
    """Лайки/Дизлайки для постов"""
    VOTE_TYPES = (
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post') # Один юзер - один голос за пост

class SavedForumPost(models.Model):
    """Закладки"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_forum_posts')
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class Notification(models.Model):
    """Уведомления для пользователей"""
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actions')
    verb = models.CharField(max_length=50)  # "liked", "forked", "replied"
    target_link = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f"Notification for {self.recipient}: {self.actor} {self.verb}"