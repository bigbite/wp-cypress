config () {
    local volumes=(
    "- $WORKING_DIR/wp-cypress/seeds:/var/www/html/seeds"
    "- $PACKAGE_DIR/plugin:/var/www/html/wp-content/plugins/wp-cypress"
  )

  if ! [ -z ${PLUGINS+x} ]; then
    for i in "${PLUGINS[@]}"
    do
      case "$i" in
        /) volume="- $WORKING_DIR:/var/www/html/wp-content/plugins/$(basename -- $WORKING_DIR)" ;;
        *) volume="- $WORKING_DIR$i:/var/www/html/wp-content/plugins/$(basename -- $i)" ;;
      esac

      volumes+=("$volume")
    done
  fi

  if ! [ -z ${THEMES+x} ]; then
    for i in "${THEMES[@]}"
    do
      case "$i" in
        /) volume="- $WORKING_DIR:/var/www/html/wp-content/themes/$(basename -- $WORKING_DIR)" ;;
        *) volume="- $WORKING_DIR$i:/var/www/html/wp-content/themes/$(basename -- $i)" ;;
      esac

      volumes+=("$volume")
    done
  fi

  cat > ./docker-compose.yml <<EOF
version: '3.7'
services:
  wp:
    depends_on:
      - db
    build: .
    ports:
      - 80:80
    environment:
      WP_VERSION: ${VERSION:-latest}
    volumes:
      - wp:/var/www/html
      $(printf '%s\n      ' "${volumes[@]}")
  db:
    image: mariadb
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: 'yes'
    volumes:
      - db:/var/lib/mysql
volumes:
  wp: {}
  db: {}
EOF
}

killdocker () {
  docker-compose down --volumes
}

updocker () {
  config
  killdocker && docker-compose build && docker-compose up -d
}

waitforwordpress () {
  until wpcli core is-installed
  do
    ((c++)) && ((c==2)) && break
    sleep 30
  done

  if wpcli core is-installed ; then
    return 0;
  else
    return 1;
  fi
}

activate () {
  wpcli plugin activate wp-cypress

  if ! [ -z ${PLUGINS+x} ]; then
    for i in "${PLUGINS[@]}"
    do
      case "$i" in
        /) plugin=$(basename -- $WORKING_DIR) ;;
        *) plugin=$(basename -- $i) ;;
      esac
      wpcli plugin activate "$plugin"
    done
  fi

  if ! [ -z ${THEMES+x} ]; then
    case ${THEMES[0]} in
      /) theme=$(basename -- $WORKING_DIR) ;;
      *) theme=$(basename -- $i) ;;
    esac

    wpcli theme activate "$theme"
  fi
}

function seed {
  wpcli seed Init
}

resetDB () {
  wpcli db reset --yes

  wpcli --allow-root core install \
  --url=http://localhost \
  --title="WP Cypress" \
  --admin_user=admin \
  --admin_password=password \
  --admin_email="admin@test.com" \
  --skip-email

  activate
  seed
}
