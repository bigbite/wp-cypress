<?php

namespace WP_Cypress;

use WP_CLI;
use WP_Cypress\Fixtures;
use WP_Cypress\Seeder\SeedCommand;
use WP_Cypress\UserSwitchingCommand;

class Plugin {
	public function __construct() {
		add_action( 'init', [ $this, 'add_seed_command' ], 1 );
		add_action( 'init', [ $this, 'add_debug_page' ], 1 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_assets' ], 1 );
	}

	/**
	 * Enquque assets
	 *
	 * @return void
	 */
	public function enqueue_assets(): void {
		wp_enqueue_script(
			'wp-cypress-disable-tooltips',
			plugins_url( '/assets/disable-tooltips.js', __DIR__ ),
			[ 'wp-blocks' ],
			filemtime( WP_CYPRESS_PLUGIN . '/assets/disable-tooltips.js' ),
			false
		);
	}

	/**
	 * Add the seed command to be executed by the WP CLI.
	 *
	 * @return void
	 */
	public function add_seed_command(): void {
		if ( ! class_exists( 'WP_CLI' ) ) {
			return;
		}

		WP_CLI::add_command( 'seed', SeedCommand::class );
	}

	/**
	 * Enable debug page
	 *
	 * @return void
	 */
	public function add_debug_page(): void {
		if ( isset( $_GET['wp-cypress'] ) && 'debug' === $_GET['wp-cypress'] ) { // phpcs:ignore
			$config = json_decode( file_get_contents( ABSPATH . 'config.json' ) );

			require_once ABSPATH . 'wp-admin/includes/plugin.php';
			require_once WP_CYPRESS_PLUGIN . '/src/validation.php';
			require_once WP_CYPRESS_PLUGIN . '/templates/debug/index.php';

			die();
		}
	}
};
