<?php

namespace WP_Cypress\Seeder;

use Exception;
use Faker\Factory;
use WP_CLI;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seeder implements SeederInterface {
	use Date;

	protected $generate;

	protected $faker;

	public function __construct() {
		$this->faker    = Factory::create();
		$this->generate = new Generator();

		try {
			$this->run();
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );
		}
	}
}
