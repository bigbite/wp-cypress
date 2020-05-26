<?php
/**
 * Plugin Name: WP Cypress
 * Plugin URI: https://bigbite.net
 * Description: Modifications for a test environment with Cypress.
 * Author: Big Bite
 * Author URI: https://bigbite.net
 * Version: 1.0.0
 */

namespace WP_Cypress;

if ( ! defined( 'WP_CYPRESS_PLUGIN' ) ) {
	define( 'WP_CYPRESS_PLUGIN', rtrim( plugin_dir_path( __FILE__ ), '/' ) );
}

require_once WP_CYPRESS_PLUGIN . '/vendor/autoload.php';
require_once WP_CYPRESS_PLUGIN . '/inc/auth.php';
require_once WP_CYPRESS_PLUGIN . '/inc/disable-tooltips.php';
require_once WP_CYPRESS_PLUGIN . '/inc/debug.php';
require_once WP_CYPRESS_PLUGIN . '/Seeder/bootstrap.php';

disable_auth();
disable_tooltips();
add_debug();
