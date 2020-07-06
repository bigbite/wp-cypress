<?php

use WP_Cypress\Seeder\Seeder;
use WP_Cypress\Fixtures;

class ExampleSeeder extends Seeder {
	public function run() {
		( new Fixtures\Post([
			'import_id'  => 10,
			'post_title' => 'Post with Custom Comments',
		]) )->create();

		( new ExampleCommentFixture( [ 'comment_post_ID' => 10 ] ) )->create( 10 );
	}
}

