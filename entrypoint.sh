#!/bin/bash
set -eu

user="$(id -u)"
group="$(id -g)"

if [ "$(id -u)" = '0' ] && [ "$(stat -c '%u:%g' .)" = '0:0' ]; then
  chown "$user:$group" .
fi

sourceTarArgs=(
  --create
  --file -
  --directory /usr/src/wordpress
  --owner "$user" --group "$group"
)
targetTarArgs=(
  --extract
  --file -
)

tar "${sourceTarArgs[@]}" . | tar "${targetTarArgs[@]}"

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

c=1
until mysqladmin ping -h"db" --silent &> /dev/null
do
  c=$((c + 1))
  if [ $c -eq 60 ]
  then
    break
  fi
  sleep 2
done

exec "$@"
