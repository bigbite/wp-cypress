<?php

use WP_Cypress\Seeder\Seeder;
use WP_Cypress\Fixtures;

class DefaultUsers extends Seeder {
	public function run() {
		( new Fixtures\User( [
			'role'       => 'editor',
			'user_login' => 'editor',
		] ) )->create();

		( new Fixtures\User( [
			'role'       => 'contributor',
			'user_login' => 'contributor',
		] ) )->create();

		( new Fixtures\User( [
			'role'       => 'author',
			'user_login' => 'author',
		] ) )->create();

		( new Fixtures\User( [
			'role'       => 'subscriber',
			'user_login' => 'subscriber',
		] ) )->create();
	}
}

