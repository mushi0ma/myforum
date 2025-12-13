#!/bin/bash

# ============================================
# GitForum SSL Initialization Script
# Использование: ./init-ssl.sh your-domain.com your@email.com
# ============================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка аргументов
if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${RED}Использование: $0 <домен> <email>${NC}"
    echo "Пример: $0 gitforum.example.com admin@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2
RSA_KEY_SIZE=4096
DATA_PATH="./certbot"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GitForum SSL Setup${NC}"
echo -e "${GREEN}  Домен: ${DOMAIN}${NC}"
echo -e "${GREEN}  Email: ${EMAIL}${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Создание директорий
echo -e "\n${YELLOW}[1/6] Создание директорий для сертификатов...${NC}"
mkdir -p "$DATA_PATH/conf"
mkdir -p "$DATA_PATH/www"

# 2. Скачивание рекомендуемых параметров TLS
echo -e "\n${YELLOW}[2/6] Скачивание параметров TLS от Let's Encrypt...${NC}"
if [ ! -f "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
    echo "  options-ssl-nginx.conf загружен"
fi

if [ ! -f "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
    echo "  ssl-dhparams.pem загружен"
fi

# 3. Создание фейковых сертификатов (чтобы Nginx мог стартануть)
echo -e "\n${YELLOW}[3/6] Создание временных самоподписанных сертификатов...${NC}"
CERT_PATH="$DATA_PATH/conf/live/$DOMAIN"
mkdir -p "$CERT_PATH"

if [ ! -f "$CERT_PATH/privkey.pem" ]; then
    openssl req -x509 -nodes -newkey rsa:$RSA_KEY_SIZE -days 1 \
        -keyout "$CERT_PATH/privkey.pem" \
        -out "$CERT_PATH/fullchain.pem" \
        -subj "/CN=localhost" 2>/dev/null
    echo "  Временные сертификаты созданы"
else
    echo "  Сертификаты уже существуют, пропускаем"
fi

# 4. Запуск Nginx
echo -e "\n${YELLOW}[4/6] Запуск Nginx...${NC}"
docker compose up -d nginx
sleep 5

# Проверка что Nginx запустился
if ! docker compose ps nginx | grep -q "Up"; then
    echo -e "${RED}Ошибка: Nginx не запустился!${NC}"
    docker compose logs nginx
    exit 1
fi
echo "  Nginx запущен успешно"

# 5. Удаление фейковых сертификатов и получение реальных
echo -e "\n${YELLOW}[5/6] Получение сертификата от Let's Encrypt...${NC}"

# Удаляем временные сертификаты
rm -rf "$CERT_PATH"

# Запрашиваем реальный сертификат
docker compose run --rm certbot certonly \
    --webroot \
    -w /var/www/certbot \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --no-eff-email \
    --force-renewal

if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка получения сертификата!${NC}"
    echo "Проверьте:"
    echo "  1. DNS записи для $DOMAIN указывают на этот сервер"
    echo "  2. Порт 80 открыт и доступен из интернета"
    echo "  3. Email $EMAIL корректный"
    exit 1
fi

# 6. Перезагрузка Nginx
echo -e "\n${YELLOW}[6/6] Перезагрузка Nginx с новыми сертификатами...${NC}"
docker compose exec nginx nginx -s reload

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL успешно настроен!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Следующие шаги:"
echo -e "  1. Обновите ${YELLOW}nginx/nginx.conf${NC}:"
echo -e "     - Раскомментируйте блок HTTPS (server 443)"
echo -e "     - Замените 'your-domain.com' на '${DOMAIN}'"
echo -e "     - Закомментируйте HTTP locations и раскомментируйте redirect"
echo ""
echo -e "  2. Обновите ${YELLOW}backend/config/settings.py${NC}:"
echo -e "     - SECURE_SSL_REDIRECT = True"
echo -e "     - SECURE_HSTS_* настройки"
echo -e "     - SESSION_COOKIE_SECURE = True"
echo -e "     - CSRF_COOKIE_SECURE = True"
echo -e "     - SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')"
echo -e "     - ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'"
echo ""
echo -e "  3. Перезапустите все сервисы:"
echo -e "     ${YELLOW}docker compose down && docker compose up -d${NC}"
echo ""
echo -e "  4. Проверьте HTTPS: ${YELLOW}https://${DOMAIN}${NC}"
echo ""
echo -e "${GREEN}Сертификаты будут автоматически обновляться каждые 12 часов.${NC}"
