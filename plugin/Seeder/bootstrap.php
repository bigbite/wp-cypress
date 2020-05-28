<?php

use WP_Cypress\Seeder\Command;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_CLI' ) ) {
	return;
}

require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/Seeds/SeedInterface.php';
require_once __DIR__ . '/Seeds/Seed.php';
require_once __DIR__ . '/Seeds/Post.php';
require_once __DIR__ . '/Seeds/Comment.php';
require_once __DIR__ . '/Generator.php';
require_once __DIR__ . '/SeederInterface.php';
require_once __DIR__ . '/Seeder.php';
require_once __DIR__ . '/Command.php';

WP_CLI::add_command( 'seed', Command::class );
