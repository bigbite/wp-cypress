<?php

namespace WP_Cypress\Seeder\Seeds;

class Post extends Seed {
	public function defaults() {
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

	public function generate() {
		$this->properties = array_merge( $this->defaults(), $this->properties );
		$post             = wp_insert_post( $this->properties );

		$this->add_meta( $post );
		$this->add_thumbnail( $post );

		return $post;
	}

	public function add_meta( $post ) {
		if ( ! isset( $this->properties['post_meta'] ) || ! is_array( $this->properties['post_meta'] ) ) {
			return;
		}

		foreach ( $this->properties['post_meta'] as $key => $value ) {
			add_post_meta( $post, $key, $value );
		}
	}

	public function add_thumbnail( $post ) {
		if ( ! isset( $this->properties['post_thumbnail'] ) ) {
			return;
		}

		$attributes = [
			'tmp_name' => download_url( $this->properties['post_thumbnail']['url'] ),
			'name'     => $this->properties['post_thumbnail']['name'] . '.jpg',
			'type'     => 'image/jpg',
		];

		if ( ! is_wp_error( $attributes['tmp_name'] ) ) {
			$media = media_handle_sideload( $attributes, $post );

			if ( is_wp_error( $media ) ) {
				return;
			}

			set_post_thumbnail( $post, $media );
		}
	}
}
