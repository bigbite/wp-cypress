wpcli () {
  docker-compose exec -T wp wp --allow-root "$@"
}
