<?php
/**
 * QUANTUM CUT — Containerfile (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');
?>
# ==============================================================================
# Dockerfile: Production PHP Container for Physics Association Platform
# Shahid Beheshti 2 High School (دبیرستان استعدادهای درخشان شهید بهشتی ۲)
# ==============================================================================

FROM php:8.3-apache

# Enable Apache mod_rewrite & mod_headers
RUN a2enmod rewrite headers

# Install system dependencies & SQLite / PDO MySQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-dev \
    libzip-dev \
    curl \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://127.0.0.1/api/system/health || exit 1

CMD ["apache2-foreground"]
