<?php

namespace WP_Cypress\Seeder\Utils;

/**
 * Return the current time, based on the timezone set in WordPress.
 *
 * @return string
 */
function now(): string {
	return current_time( 'Y-m-d H:i:s' );
}
