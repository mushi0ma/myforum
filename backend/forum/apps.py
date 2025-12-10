from django.apps import AppConfig


class ForumConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forum'

    def ready(self):
        """Регистрируем сигналы при запуске приложения"""
        import forum.signals  # noqa
