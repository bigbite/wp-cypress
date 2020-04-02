<?php

namespace WP_Cypress\Seeder\Seeds;

use WP_Cypress\Seeder\Seeds\SeedInterface;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seed implements SeedInterface {
	use Date;

	protected $faker;

	protected $properties = [];

	public function __construct( $properties ) {
		$this->faker      = \Faker\Factory::create();
		$this->properties = $properties;
	}
}
