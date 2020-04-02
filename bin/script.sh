#!/bin/bash

WORKING_DIR="$INIT_CWD"
PACKAGE_DIR="$INIT_CWD/node_modules/cypress-wordpress"
LOGFILE="$PACKAGE_DIR/debug.log"
DOMAIN=http://localhost

if [ -f $WORKING_DIR/wp-cypress/.env ]; then
  set -o allexport
  source $WORKING_DIR/wp-cypress/.env
  set +o allexport
fi

source $PACKAGE_DIR/bin/run.sh
source $PACKAGE_DIR/bin/wpcli.sh
source $PACKAGE_DIR/bin/helpers.sh

trap "stop_spinner; exit 1" 2

cd $PACKAGE_DIR

case $1 in
  start)
    run updocker "Starting test environment" "Test environment running on port 80" "Something went wrong"
    run waitforwordpress "Downloading & Installing WordPress" "WordPress Installed" "Timed Out"
    run activate "Activating Themes & Plugins" "Themes & Plugins Activated" "Something went wrong"
    run seed "Seeding Database" "Database Seeded" "Something went wrong"
    ;;

  stop)
    run killdocker "Stopping Test Environment" "Test Environment Stopped" "Something went wrong"
    ;;

  wp)
    wpcli "${@:2}"
    ;;

  resetDB)
    resetDB
    ;;

  *)
    echo -e "Available Commands: \n - wp-cypress start \n - wp-cypress stop \n - wp-cypress wp"
    ;;
esac
