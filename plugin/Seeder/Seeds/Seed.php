<?php

namespace WP_Cypress\Seeder\Seeds;

use Faker\Factory;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seed implements SeedInterface {
	use Date;

	protected $faker;

	protected $properties = [];

	public function __construct( $properties ) {
		$this->faker      = Factory::create();
		$this->properties = $properties;
	}
}
