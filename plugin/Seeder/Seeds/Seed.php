<?php

namespace WP_Cypress\Seeder\Seeds;

use Faker\Factory;
use Faker\Generator as Faker;
use WP_Cypress\Seeder\Traits\Date;

abstract class Seed implements SeedInterface {
	use Date;

	/**
	 * @var Faker
	 */
	protected $faker;

	/**
	 * @var array
	 */
	protected $properties;

	public function __construct( array $properties = [], Faker $faker = null ) {
		$this->properties = $properties;

		$this->faker = $faker ?? Factory::create();
	}
}
