<?php

function add_debug() {
	if ( isset( $_GET['wp-cypress'] ) && 'debug' === $_GET['wp-cypress'] ) { // phpcs:ignore
		$config = json_decode( file_get_contents( ABSPATH . 'config.json' ) );

		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once WP_CYPRESS_PLUGIN . '/inc/validation.php';
		require_once WP_CYPRESS_PLUGIN . '/templates/debug/index.php';

		die();
	}
}
