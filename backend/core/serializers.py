from rest_framework import serializers
from .models import Repositories, Users, Commits

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'avatar_url']

class RepositorySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Repositories
        fields = ['id', 'name', 'description', 'is_public', 'stars_count', 'owner', 'created_at']

class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commits
        fields = ['hash', 'message', 'branch', 'committed_at']