version=$1
HARD_RESET=$2

shopt -s extglob
rm -rf !(wp-config.php|seeds|wp-content|update.sh|.htaccess)

if ${HARD_RESET}; then rm wp-config.php && echo "Hello"; fi

cp -rfp ../${version}/* ./

wp --allow-root core version
