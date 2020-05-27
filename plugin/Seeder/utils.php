<?php

namespace WP_Cypress\Seeder\Utils;

function now(): string {
	return current_time( 'Y-m-d H:i:s' );
}
