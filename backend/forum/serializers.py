from rest_framework import serializers
from .models import ForumPost, ForumComment, Notification, SavedForumPost

class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.ReadOnlyField(source='actor.username')
    avatar = serializers.ReadOnlyField(source='actor.avatar_url') # Assuming User has avatar_url, or handle appropriately

    class Meta:
        model = Notification
        fields = ['id', 'actor_username', 'avatar', 'verb', 'target_link', 'is_read', 'timestamp']

class ForumCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = ForumComment
        fields = ['id', 'author_username', 'content', 'created_at', 'parent']

class ForumPostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = ['id', 'author_username', 'title', 'description', 'code_snippet',
                  'language', 'views', 'forks_count', 'is_solved', 'created_at',
                  'trending_score', 'comments_count', 'likes_count']
        read_only_fields = ['views', 'created_at', 'trending_score']

    def get_likes_count(self, obj):
        return obj.votes.filter(vote_type='like').count()


class SavedForumPostSerializer(serializers.ModelSerializer):
    """Serializer for bookmarked posts with full post data"""
    post = ForumPostSerializer(read_only=True)
    post_id = serializers.IntegerField(write_only=True)
    saved_at = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = SavedForumPost
        fields = ['id', 'post', 'post_id', 'saved_at']
        read_only_fields = ['id', 'saved_at']