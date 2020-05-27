<?php

namespace WP_Cypress\Seeder\Seeds;

class Post extends Seed {
	public function defaults(): array {
		$title    = $this->faker->sentence();
		$slug     = sanitize_title( $title );
		$now      = $this->now();
		$defaults = [
			'post_author'       => 1,
			'post_type'         => 'post',
			'post_status'       => 'publish',
			'post_name'         => $slug,
			'post_title'        => $title,
			'post_date'         => $now,
			'post_date_gmt'     => $now,
			'post_modified'     => $now,
			'post_modified_gmt' => $now,
			'post_content'      => $this->faker->realText( 1000 ),
			'post_excerpt'      => $this->faker->realText( 100 ),
		];

		/**
		 * Optional post thumbnail, left out of defaults for performance.
		[
			'post_thumbnail'  => [
			'url'             => 'https://unsplash.it/1140/768/?random',
			'name'            => str_replace( '.', '', $this->faker->sentence() ),
		]
		*/

		return $defaults;
	}

	public function generate() : int {
		$this->properties = array_merge( $this->defaults(), $this->properties );

		$post_id = wp_insert_post( $this->properties );
		if ( is_wp_error( $post_id ) ) {
			return 0;
		}

		$this->add_meta( $post_id );
		$this->add_thumbnail( $post_id );

		return $post_id;
	}

	public function add_meta( int $post_id ) {
		if ( ! isset( $this->properties['post_meta'] ) || ! is_array( $this->properties['post_meta'] ) ) {
			return;
		}

		foreach ( $this->properties['post_meta'] as $key => $value ) {
			add_post_meta( $post_id, $key, $value );
		}
	}

	public function add_thumbnail( int $post_id ) {
		if ( ! isset( $this->properties['post_thumbnail'] ) ) {
			return;
		}

		$attributes = [
			'tmp_name' => download_url( $this->properties['post_thumbnail']['url'] ),
			'name'     => $this->properties['post_thumbnail']['name'] . '.jpg',
			'type'     => 'image/jpg',
		];

		if ( ! is_wp_error( $attributes['tmp_name'] ) ) {
			$media = media_handle_sideload( $attributes, $post_id );

			if ( is_wp_error( $media ) ) {
				return;
			}

			set_post_thumbnail( $post_id, $media );
		}
	}
}
