FROM php:7.3-apache

# install the PHP extensions we need
RUN apt-get update && apt-get install -y wget libpng-dev libjpeg-dev gnupg default-mysql-client nano less && rm -rf /var/lib/apt/lists/* \
	&& docker-php-ext-configure gd \
	&& docker-php-ext-install gd mysqli

RUN a2enmod rewrite

VOLUME /var/www/html

RUN curl -o /bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
	&& chmod +x /bin/wp \
	&& wp --info --allow-root

ENV WP_VERSION latest

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

CMD ["apache2-foreground"]
