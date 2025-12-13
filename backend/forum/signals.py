from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import PostVote, ForumComment, Notification
from .tasks import update_single_post_trending_score


@receiver(post_save, sender=PostVote)
def create_notification_on_vote(sender, instance, created, **kwargs):
    """
    Создает уведомление автору поста, когда кто-то ставит лайк.
    """
    if created and instance.vote_type == 'like':
        post = instance.post
        # Не уведомляем, если лайкнул сам себя
        if instance.user != post.author:
            Notification.objects.create(
                recipient=post.author,
                actor=instance.user,
                verb='liked',
                target_link=f"/post/{post.id}"
            )

@receiver(post_save, sender=PostVote)
def update_score_on_vote(sender, instance, created, **kwargs):
    """
    Обновляет trending score поста при добавлении/изменении голоса.
    Запускает асинхронную Celery задачу.
    """
    if instance.post_id:
        # Запускаем задачу с задержкой 5 секунд для группировки нескольких изменений
        update_single_post_trending_score.apply_async(
            args=[instance.post_id],
            countdown=5
        )


@receiver(post_delete, sender=PostVote)
def update_score_on_vote_delete(sender, instance, **kwargs):
    """
    Обновляет trending score поста при удалении голоса.
    """
    if instance.post_id:
        update_single_post_trending_score.apply_async(
            args=[instance.post_id],
            countdown=5
        )


@receiver(post_save, sender=ForumComment)
def update_score_on_comment(sender, instance, created, **kwargs):
    """
    Обновляет trending score поста при добавлении комментария.
    """
    if created and instance.post_id:
        update_single_post_trending_score.apply_async(
            args=[instance.post_id],
            countdown=5
        )


@receiver(post_delete, sender=ForumComment)
def update_score_on_comment_delete(sender, instance, **kwargs):
    """
    Обновляет trending score поста при удалении комментария.
    """
    if instance.post_id:
        update_single_post_trending_score.apply_async(
            args=[instance.post_id],
            countdown=5
        )
