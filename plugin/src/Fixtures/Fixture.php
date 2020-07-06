<?php

namespace WP_Cypress\Fixtures;

use Faker\Factory;
use Faker\Generator as Faker;

abstract class Fixture implements FixtureInterface {
	/**
	 * @var Faker
	 */
	protected $faker;

	/**
	 * @var array
	 */
	protected $properties;

	/**
	 * Construct seed.
	 *
	 * @param array $properties
	 * @param \Faker\Generator $faker
	*/
	public function __construct( array $properties = [], Faker $faker = null ) {
		$this->properties = $properties;

		$this->faker = $faker ?? Factory::create();
	}

	/**
	 * Generate the specified amount of records.
	 *
	 * @param integer $count
	 * @return void
	 */
	public function create( int $count = 1 ): void {
		for ( $i = 1; $i <= $count; $i++ ) {
			$this->generate();
		}
	}
}
