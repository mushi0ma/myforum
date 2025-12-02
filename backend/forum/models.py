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
    is_solved = models.BooleanField(default=False) # Галочка "Ответ найден"
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    tags = TaggableManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Forum Post"
        verbose_name_plural = "Forum Posts"

    def __str__(self):
        return self.title

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