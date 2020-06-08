<?php

use WP_Cypress\Seeder\Command;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_CLI' ) ) {
	return;
}

require_once __DIR__ . '/utils.php';

WP_CLI::add_command( 'seed', Command::class );
