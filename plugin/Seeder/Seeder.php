<?php

namespace WP_Cypress\Seeder;

use \WP_Cypress\Seeder\SeederInterface;
use \WP_Cypress\Seeder\Generator;
use \WP_Cypress\Seeder\Traits\Date;

abstract class Seeder implements SeederInterface {
	use Date;

	protected $generate;

	protected $faker;

	public function __construct() {
		$this->faker    = \Faker\Factory::create();
		$this->generate = new Generator();

		try {
			$this->run();
		} catch ( Exception $e ) {
			\WP_CLI::error( $e->getMessage() );
		}
	}
}
