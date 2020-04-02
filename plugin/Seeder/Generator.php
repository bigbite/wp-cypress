<?php

namespace WP_Cypress\Seeder;

use WP_Cypress\Seeder\Seeds\Post;

class Generator {
	public function posts( $properties = [], $count = 1 ) {
		$progress = \WP_CLI\Utils\make_progress_bar( 'Generating posts', $count );

		$post = new Post( $properties );

		for ( $i = 1; $i <= $count; $i++ ) {
			$post->generate();
			$progress->tick();
		}

		$progress->finish();
	}
}
