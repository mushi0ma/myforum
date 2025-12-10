from celery import shared_task
from django.utils import timezone
from .models import ForumPost
import logging

logger = logging.getLogger(__name__)


@shared_task
def update_trending_scores():
    """
    Периодическая задача для пересчета trending_score всех постов.
    Запускается каждые 15 минут через Celery Beat.
    """
    try:
        posts = ForumPost.objects.all()
        updated_count = 0

        for post in posts:
            old_score = post.trending_score
            new_score = post.calculate_trending_score()

            # Обновляем только если score изменился (оптимизация)
            if old_score != new_score:
                post.trending_score = new_score
                # Используем update_fields чтобы не вызывать весь save() и избежать рекурсии
                post.save(update_fields=['trending_score'])
                updated_count += 1

        logger.info(f"Updated trending scores for {updated_count}/{posts.count()} posts")
        return f"Success: {updated_count} posts updated"

    except Exception as e:
        logger.error(f"Error updating trending scores: {str(e)}")
        raise


@shared_task
def update_single_post_trending_score(post_id):
    """
    Обновляет trending score для конкретного поста.
    Используется при создании/обновлении лайков, комментариев, форков.

    Args:
        post_id: ID поста для обновления
    """
    try:
        post = ForumPost.objects.get(id=post_id)
        new_score = post.calculate_trending_score()

        if post.trending_score != new_score:
            post.trending_score = new_score
            post.save(update_fields=['trending_score'])
            logger.info(f"Updated trending score for post {post_id}: {new_score}")

        return f"Success: Post {post_id} score updated to {new_score}"

    except ForumPost.DoesNotExist:
        logger.error(f"Post {post_id} not found")
        return f"Error: Post {post_id} not found"
    except Exception as e:
        logger.error(f"Error updating post {post_id} trending score: {str(e)}")
        raise
