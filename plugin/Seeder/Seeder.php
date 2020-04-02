<?php

namespace WP_Cypress\Seeder;

use \WP_Cypress\Seeder\SeederInterface;
use \WP_Cypress\Seeder\Generator;

abstract class Seeder implements SeederInterface {
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
