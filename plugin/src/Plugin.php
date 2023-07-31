<?php

namespace WP_Cypress;

use WP_CLI;
use WP_Cypress\Fixtures;
use WP_Cypress\Seeder\SeedCommand;

class Plugin {
	public function __construct() {
		add_action( 'init', [ $this, 'add_seed_command' ], 1 );
		add_action( 'init', [ $this, 'initialize_admin_user_meta' ], 0 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_assets' ], 1 );

		$this->add_user_command();
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
	 * Add command to set which user should be set when bypassing auth.
	 *
	 * @return void
	 */
	public function add_user_command(): void {
		if ( ! class_exists( 'WP_CLI' ) ) {
			return;
		}

		WP_CLI::add_command( 'wp-cypress-set-user', [ $this, 'set_user' ] );
	}

	/**
	 * Store the user ID in a tempfile of the user to bypass auth with.
	 *
	 * @param array $args
	 * @return void
	 */
	public function set_user( $args, array $assoc_args ): void {
		$user_id = 'false';

		$user_id_file = ABSPATH . '.userid';

		if ( isset( $assoc_args['logout'] ) ) {
			if ( file_exists( $user_id_file ) ) {
				unlink( $user_id_file );
			}

			WP_CLI::success( 'Current User logged out' );
			return;
		}

		if ( 'loggedout' !== $args[0] ) {
			$user = get_user_by( 'login', $args[0] );

			if ( ! $user ) {
				WP_CLI::error( "User {$args[0]} doesn't exits." );
				return;
			}

			$user_id = $user->ID;
		}

		file_put_contents( $user_id_file, $user_id );
		WP_CLI::success( 'Current User set to ' . $args[0] );
	}

	/**
	 * Sets default meta values on the root/admin user (this has to be done
	 * separately from the other users)
	 *
	 * @return void
	 */
	public function initialize_admin_user_meta(): void {
		global $wpdb;
		$user_preferences_meta_key = $wpdb->get_blog_prefix() . 'persisted_preferences';

		if ( !get_user_meta(1, $user_preferences_meta_key) ) {
			update_user_meta(1, $user_preferences_meta_key, [
				"core/edit-post" => [
					"welcomeGuide" => false,
				],
			]);
		}
	}
};
