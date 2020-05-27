<?php

namespace WP_Cypress\Seeder\Seeds;

use WP_Cypress\Seeder\Utils\now;

class Comment extends Seed {
	public function defaults(): array {
		return [
			'comment_post_ID'      => 1,
			'comment_author'       => 'admin',
			'comment_author_email' => 'admin@test.com',
			'comment_content'      => $this->faker->realText( 100 ),
			'user_id'              => 1,
			'comment_date'         => now(),
		];
	}

	public function generate(): int {
		$id = (int) wp_insert_comment( array_merge( $this->defaults(), $this->properties ) );

		if ( $id && isset( $this->properties['comment_meta'] ) && is_array( $this->properties['comment_meta'] ) ) {
			foreach ( $this->properties['comment_meta'] as $key => $value ) {
				add_comment_meta( $id, $key, $value );
			}
		}

		return $id;
	}
}
