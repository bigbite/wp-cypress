#!/bin/bash
set -eu

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
