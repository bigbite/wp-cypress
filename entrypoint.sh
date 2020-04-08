#!/bin/bash
set -eu
if [ -f wp-config.php ]; then
  rm wp-config.php
fi

: ${WP_LOCALE:=${WP_LOCALE:-en_US}}
: ${WP_ADMIN_EMAIL:=${WP_ADMIN_EMAIL:-admin@example.com}}
: ${WP_DB_HOST:=db}
: ${WP_DB_USER:=${MYSQL_ENV_MYSQL_USER:-root}}
: ${WP_DB_PASSWORD:=''}
: ${WP_DB_NAME:=${MYSQL_ENV_MYSQL_DATABASE:-wordpress}}

wp core --allow-root download \
  --version=${WP_VERSION} \
  --force --debug
c=1

until mysqladmin ping -h"$WP_DB_HOST" --silent &> /dev/null
do
  c=$((c + 1))
  if [ $c -eq 60 ]
  then
    break
  fi
  sleep 2
done

# Generate the wp-config file for debugging.
wp core --allow-root config \
  --dbhost="$WP_DB_HOST" \
  --dbname="$WP_DB_NAME" \
  --dbuser="$WP_DB_USER" \
  --dbpass="$WP_DB_PASSWORD" \
  --locale="$WP_LOCALE" \
  --extra-php <<PHP
define( 'WP_DEBUG', true );
PHP

cat > .htaccess <<EOF
# BEGIN WordPress
# The directives (lines) between `BEGIN WordPress` and `END WordPress` are
# dynamically generated, and should only be modified via WordPress filters.
# Any changes to the directives between these markers will be overwritten.
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
EOF

chown "www-data:www-data" .htaccess

# Create the database.
wp db --allow-root create

wp --allow-root core install \
  --url=http://localhost \
  --title="WP Cypress" \
  --admin_user=admin \
  --admin_password=password \
  --admin_email="admin@test.com" \
  --skip-email \
exec "$@"
