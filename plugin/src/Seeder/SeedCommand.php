<?php

namespace WP_Cypress\Seeder;

use Exception;
use WP_CLI;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class SeedCommand {
	const DEFAULT_SEEDS_DIR = 'wp-content/plugins/wp-cypress/src/Seeds/*';

	const USER_SEEDS_DIR = 'seeds/*';

	/**
	 * Find and call the relevant seeder when invoked.
	 *
	 * @param array $args
	 * @return void
	 */
	public function __invoke( array $args, array $assoc_args ): void {
		$seeder_name = $args[0];

		if ( empty( $seeder_name ) ) {
			WP_CLI::error(
				sprintf( 'You need to provide the name of a seeder.' )
			);

			return;
		}

		$this->include_dir( self::USER_SEEDS_DIR );
		$this->include_dir( self::DEFAULT_SEEDS_DIR );

		if ( isset( $assoc_args['clean'] ) ) {
			$this->clean( $seeder_name );
			return;
		}

		if ( isset( $assoc_args['clean-first'] ) ) {
			$this->clean( $seeder_name );
		}

		$this->seed( $seeder_name );
	}

	/**
	 * Recursively include all files in a directory
	 *
	 * @param string $dir
	 * @return void
	 */
	public function include_dir( string $dir ): void {
		$files = glob( $dir );

		foreach ( $files as $filename ) {
			if ( is_dir( $filename ) ) {
				$this->include_dir( $filename . '/*' );
			}

			if ( is_file( $filename ) ) {
				require_once $filename;
			}
		}
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
		$this->validate_seeder( $seeder_name );

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

	/**
	 * Run an individual seeder clean routine.
	 *
	 * @param string $seeder_name
	 * @return void
	 */
	public function clean( string $seeder_name ): void {
		$this->validate_seeder( $seeder_name );

		$start_time = microtime( true );

		try {
			/** @var SeederInterface $seeder */
			$seeder = new $seeder_name();

			if ( ! method_exists( $seeder, 'clean' ) ) {
				WP_CLI::error( "clean() method does not exist on seeder {$seeder} class." );
			}

			$seeder->clean();
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );
		}

		$run_time = round( microtime( true ) - $start_time, 2 );

		WP_CLI::success( 'Seeder ' . $seeder_name . ' cleaned in ' . $run_time . ' seconds' );
	}
}
