<?php

namespace WP_Cypress\Seeder\Seeds;

use Faker\Factory;
use Faker\Generator as Faker;

abstract class Seed implements SeedInterface {
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
