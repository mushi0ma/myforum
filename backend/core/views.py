from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from dj_rest_auth.views import LoginView
from .models import Repositories, Commits
from .serializers import RepositorySerializer, CommitSerializer
from .services.n8n_client import N8nClient

# === CUSTOM AUTH VIEWS (Hardening) ===

class CustomLoginView(LoginView):
    """
    Кастомный вход с жестким лимитом попыток (5/min).
    """
    throttle_scope = 'login'

# === STANDARD API VIEWSETS (CRUD) ===

class RepositoryViewSet(viewsets.ModelViewSet):
    """
    Управление репозиториями пользователя.
    """
    permission_classes = [AllowAny] # Позже лучше сменить на IsAuthenticatedOrReadOnly
    queryset = Repositories.objects.all().order_by('-created_at')
    serializer_class = RepositorySerializer

class CommitViewSet(viewsets.ModelViewSet):
    """
    Управление коммитами.
    """
    permission_classes = [IsAuthenticated]
    queryset = Commits.objects.all().order_by('-committed_at')
    serializer_class = CommitSerializer

# === AI TOOLS ENDPOINTS (Proxy to n8n) ===

class GenerateCommitMessageView(APIView):
    """
    Генерирует сообщение коммита через n8n (CommitGen).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        diff = request.data.get('diff')
        filename = request.data.get('filename', 'unknown_file')

        if not diff:
            return Response({"error": "No diff provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Вызываем n8n сервис
        result = N8nClient.trigger_commit_generation(diff, filename)
        
        if "error" in result:
            return Response(result, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        return Response(result)

class AISmartReviewView(APIView):
    """
    Проводит ревью кода через n8n (CodeReviewBot).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        diff = request.data.get('diff')
        filename = request.data.get('filename', 'unknown.js')
        lang = request.data.get('lang', 'javascript')
        
        if not diff:
            return Response({"error": "No diff provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Вызываем n8n сервис
        result = N8nClient.trigger_code_review(diff, filename, lang)
        
        if "error" in result:
            return Response(result, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        return Response(result)