<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_CLI' ) ) {
	return;
}

require_once __DIR__ . '/Seeds/SeedInterface.php';
require_once __DIR__ . '/Traits/Date.php';
require_once __DIR__ . '/Seeds/Seed.php';
require_once __DIR__ . '/Seeds/Post.php';
require_once __DIR__ . '/Generator.php';
require_once __DIR__ . '/SeederInterface.php';
require_once __DIR__ . '/Seeder.php';
require_once __DIR__ . '/Command.php';

use \WP_Cypress\Seeder\Command;

\WP_CLI::add_command( 'seed', Command::class );

