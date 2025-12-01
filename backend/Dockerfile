# Базовый образ
FROM python:3.10-slim

# Настройки Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Рабочая папка
WORKDIR /app

# 1. Устанавливаем системные пакеты + Node.js (для Tailwind)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Устанавливаем Python зависимости
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 3. Копируем код проекта
COPY . /app/

# 4. Собираем статику (заглушка, чтобы не падало при сборке)
# В реальности Tailwind будет собираться здесь
RUN python manage.py collectstatic --noinput

# Открываем порт
EXPOSE 8000

# По умолчанию запускаем Gunicorn (Production mode)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]