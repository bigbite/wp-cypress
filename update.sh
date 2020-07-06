version=$1

shopt -s extglob
rm -rf !(seeds|wp-content|update.sh|.htaccess)
cp -rfp ../${version}/* ./

wp --allow-root core version
