from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # === API АВТОРИЗАЦИЯ (для React) ===
    # Вход, выход, смена пароля, получение user info
    path('api/auth/', include('dj_rest_auth.urls')),
    # Регистрация
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # === OAUTH (для редиректов Google/GitHub) ===
    path('accounts/', include('allauth.urls')),

    # === БИЗНЕС-ЛОГИКА И ИНСТРУМЕНТЫ ===
    # Подключаем core.urls, где лежат repos/, commits/ и tools/ (AI)
    # Итоговые пути будут: /api/repos/, /api/tools/generate-commit/ и т.д.
    path('api/', include('core.urls')),
    
    # Форум (посты, комментарии)
    path('api/forum/', include('forum.urls')),

    # === ДОКУМЕНТАЦИЯ (Swagger) ===
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]