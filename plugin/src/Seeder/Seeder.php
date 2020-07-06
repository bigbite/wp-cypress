<?php

namespace WP_Cypress\Seeder;

use Faker\Factory;
use Faker\Generator as Faker;

abstract class Seeder implements SeederInterface {
	/**
	 * @var Faker
	 */
	protected $faker;

	/**
	 * Constuct a seeder with a faker instance
	 *
	 * @param Faker $faker
	 */
	public function __construct( Faker $faker = null ) {
		$this->faker = $faker ?? Factory::create();
	}

	/**
	 * Run an array of seeders, in the order that they are called.
	 *
	 * @param array $seeders
	 * @return void
	 */
	public function call( array $seeders ): void {
		$command = new SeedCommand();

		foreach ( $seeders as $seeder ) {
			$command( [ $seeder ] );
		}
	}

}
