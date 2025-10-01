FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

CMD sh -c "\
    until pg_isready -h \"${DB_HOST}\" -p \"${DB_PORT}\"; do \
    echo '⏳ Aguardando o banco de dados...'; \
    sleep 2; \
    done; \
    echo '✅ Banco de dados pronto!'; \
    php artisan migrate --force; \
    php artisan config:clear; \
    php artisan serve --host=0.0.0.0 --port=8000"
