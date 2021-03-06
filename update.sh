VERSION=$1
HARD_RESET=$2

shopt -s extglob
rm -rf !(wp-config.php|wp-cypress-config.php|seeds|wp-content|update.sh|.htaccess)

# Ensure uploads work
if ${HARD_RESET}; then rm -rf /var/www/html/wp-content/uploads && mkdir -p /var/www/html/wp-content/uploads && chmod -R 777 /var/www/html/wp-content/uploads; fi

if ${HARD_RESET}; then rm wp-config.php; fi

cp -rfp ../${VERSION}/* ./

wp --allow-root core version
