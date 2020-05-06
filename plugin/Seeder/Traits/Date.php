<?php

namespace WP_Cypress\Seeder\Traits;

trait Date {
	public function now() {
		return date( 'Y-m-d H:i:s', time() );
	}
}

