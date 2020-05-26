<?php

namespace WP_Cypress\Seeder;

use WP_Cypress\Seeder\Seeds\Comment;
use WP_Cypress\Seeder\Seeds\Post;

use function WP_CLI\Utils\make_progress_bar;

class Generator {
	public function posts( array $properties = [], int $count = 1 ) {
		$progress = make_progress_bar( 'Generating posts', $count );

		$post = new Post( $properties );

		for ( $i = 1; $i <= $count; $i++ ) {
			$post->generate();
			$progress->tick();
		}

		$progress->finish();
	}

	public function comments( array $properties = [], int $count = 1 ) {
		$progress = make_progress_bar( 'Generating comments', $count );

		$comment = new Comment( $properties );

		for ( $i = 1; $i <= $count; $i++ ) {
			$comment->generate();
			$progress->tick();
		}

		$progress->finish();
	}
}
