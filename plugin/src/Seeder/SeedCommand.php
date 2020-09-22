<?php

namespace WP_Cypress\Seeder;

use Exception;
use WP_CLI;

class SeedCommand {
	const DEFAULT_SEEDS_DIR = 'wp-content/plugins/wp-cypress/src/seeds';

	const USER_SEEDS_DIR = 'seeds';

	/**
	 * Find and call the relevant seeder when invoked.
	 *
	 * @param array $args
	 * @return void
	 */
	public function __invoke( array $args ): void {
		$seeder_name = $args[0];

		if ( empty( $seeder_name ) ) {
			WP_CLI::error(
				sprintf( 'You need to provide the name of a seeder.' )
			);

			return;
		}

		foreach ( glob( getcwd() . '/' . self::USER_SEEDS_DIR . '/*.php' ) as $filename ) {
			require_once $filename;
		}

		foreach ( glob( getcwd() . '/' . self::DEFAULT_SEEDS_DIR . '/*.php' ) as $filename ) {
			require_once $filename;
		}

		$this->seed( $seeder_name );
	}

	/**
	 * Validate whether the supplied seeder is a sub class of Seeder.
	 *
	 * @param string $seeder_name
	 * @return void
	 */
	public function validate_seeder( string $seeder_name ): void {
		if ( ! strpos( get_parent_class( $seeder_name ), 'Seeder' ) ) {
			WP_CLI::error(
				sprintf( '"%s" is not a seeder.', $seeder_name )
			);
		}
	}

	/**
	 * Run an individual seeder.
	 *
	 * @param string $seeder_name
	 * @return void
	 */
	public function seed( string $seeder_name ): void {
		//$this->validate_seeder( $seeder_name );

		$start_time = microtime( true );

		try {
			/** @var SeederInterface $seeder */
			$seeder = new $seeder_name();
			$seeder->run();
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );
		}

		$run_time = round( microtime( true ) - $start_time, 2 );

		WP_CLI::success( 'Seeded ' . $seeder_name . ' in ' . $run_time . ' seconds' );
	}
}
