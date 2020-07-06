<?php

namespace WP_Cypress\Fixtures;

interface FixtureInterface {
	/**
	 * Return the default properties of a seed.
	 *
	 * @return array
	 */
	public function defaults(): array;

	/**
	 * Create a new record for the seed.
	 *
	 * @return void
	 */
	public function generate(): void;
}
