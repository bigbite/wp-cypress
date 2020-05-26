<?php

namespace WP_Cypress\Seeder\Seeds;

use Faker\Factory;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seed implements SeedInterface {
	use Date;

	protected $faker;

	protected $properties;

	public function __construct( array $properties = [] ) {
		$this->properties = $properties;

		$this->faker = Factory::create();
	}
}
