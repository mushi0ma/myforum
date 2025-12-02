from rest_framework import serializers
from .models import ForumPost, ForumComment

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
                  'language', 'views', 'is_solved', 'created_at', 'comments_count', 'likes_count']
        read_only_fields = ['views', 'created_at']

    def get_likes_count(self, obj):
        return obj.votes.filter(vote_type='like').count()