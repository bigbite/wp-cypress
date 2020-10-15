<?php

namespace WP_Cypress\Utils;

/**
 * Return the current time, based on the timezone set in WordPress.
 *
 * @return string
 */
function now(): string {
	return current_time( 'Y-m-d H:i:s' );
}


if ( class_exists( 'WP_CLI' ) ) {
	$wp_cypress_set_user = function( $args, $assoc_args ) {
		file_put_contents( get_home_path() . '.userid', $args[0] );
		\WP_CLI::success( 'Current User set to ID: ' . $args[0] );
	};
	\WP_CLI::add_command( 'wp-cypress-set-user', $wp_cypress_set_user );
}