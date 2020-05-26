<?php

namespace WP_Cypress\Seeder;

use Exception;
use Faker\Factory;
use Faker\Generator as Faker;
use WP_CLI;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seeder implements SeederInterface {
	use Date;

	/**
	 * @var Faker
	 */
	protected $faker;

	/**
	 * @var Generator
	 */
	protected $generate;

	public function __construct( Generator $generate = null, Faker $faker = null ) {
		$this->generate = $generate ?? new Generator();

		$this->faker = $faker ?? Factory::create();

		try {
			$this->run();
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );
		}
	}
}
