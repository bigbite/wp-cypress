<?php

use WP_Cypress\Seeder\Seeder;
use WP_Cypress\Fixtures;

class DefaultSeeder extends Seeder {
	public function run() {
		( new Fixtures\Post() )->create( 3 );

		$this->call([
			'ExampleSeeder',
		]);
	}
}

