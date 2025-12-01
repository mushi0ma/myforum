from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Repositories, Commits
from .serializers import RepositorySerializer, CommitSerializer

class RepositoryViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Repositories.objects.all().order_by('-created_at')
    serializer_class = RepositorySerializer

class CommitViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Commits.objects.all().order_by('-committed_at')
    serializer_class = CommitSerializer