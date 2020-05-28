<?php

namespace WP_Cypress\Seeder\Seeds;

interface SeedInterface {
	public function defaults(): array;

	public function generate(): int;
}
