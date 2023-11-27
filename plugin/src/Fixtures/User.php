<?php

namespace WP_Cypress\Fixtures;

use WP_Cypress\Utils;

class User extends Fixture {
	/**
	 * Gets default values of the user.
	 *
	 * @return array
	 */
	public function defaults(): array {
		global $wpdb;
		$user_preferences_meta_key = $wpdb->get_blog_prefix() . 'persisted_preferences';

		return [
			'user_pass'       => 'password',
			'user_login'      => $this->faker->unique()->userName(),
			'user_url'        => $this->faker->url(),
			'user_email'      => $this->faker->unique()->email(),
			'display_name'    => $this->faker->name(),
			'first_name'      => $this->faker->firstName(),
			'last_name'       => $this->faker->lastName(),
			'description'     => $this->faker->realText( 200 ),
			'user_registered' => Utils\now(),
			'role'            => 'administrator',
			'meta_input' => [
				$user_preferences_meta_key => [
					"core/edit-post" => [
						"welcomeGuide" => false,
					],
				],
			],
		];
	}

	/**
	 * Generates a new user record.
	 *
	 * @return void
	 */
	public function generate(): void {
		$user = wp_insert_user( array_merge( $this->defaults(), $this->properties ) );

		if ( isset( $this->properties['user_meta'] ) && is_array( $this->properties['user_meta'] ) ) {
			foreach ( $this->properties['user_meta'] as $key => $value ) {
				add_user_meta( $user, $key, $value );
			}
		}
	}
}
