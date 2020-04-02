<?php
/**
 * Plugin Name: Cypress WordPress
 * Plugin URI: https://bigbite.net
 * Description: Modifications for a test environment with Cypress.
 * Author: Big Bite
 * Author URI: https://bigbite.net
 * Version: 1.0.0
 */

namespace WP_Cypress;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/auth.php';
require_once __DIR__ . '/inc/disable-tooltips.php';
require_once __DIR__ . '/Seeder/bootstrap.php';

