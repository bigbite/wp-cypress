<?php
/**
 * Plugin Name: WP Cypress
 * Plugin URI: https://bigbite.net
 * Description: Modifications for a test environment with Cypress.
 * Author: Big Bite
 * Author URI: https://bigbite.net
 * Version: 1.0.0
 */

if ( ! defined( 'WP_CYPRESS_PLUGIN' ) ) {
	define( 'WP_CYPRESS_PLUGIN', rtrim( plugin_dir_path( __FILE__ ), '/' ) );
}

require_once WP_CYPRESS_PLUGIN . '/src/utils.php';
require_once WP_CYPRESS_PLUGIN . '/src/validation.php';

if ( is_readable( WP_CYPRESS_PLUGIN . '/vendor/autoload.php' ) ) {
	include WP_CYPRESS_PLUGIN . '/vendor/autoload.php';
}

new WP_Cypress\Plugin();
