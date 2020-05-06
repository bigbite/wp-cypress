<?php

namespace WP_Cypress\Seeder\Seeds;

interface SeedInterface {
	public function defaults();

	public function generate();
}
