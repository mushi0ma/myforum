import os
from celery import Celery

# Указываем настройки Django по умолчанию
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("config")

# Используем настройки из settings.py, начинающиеся с CELERY_
app.config_from_object("django.conf:settings", namespace="CELERY")

# Автоматически находим задачи в файлах tasks.py внутри приложений
app.autodiscover_tasks()
