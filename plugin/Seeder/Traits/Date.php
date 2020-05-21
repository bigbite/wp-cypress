<?php

namespace WP_Cypress\Seeder\Traits;

trait Date {
	public function now() {
		return current_time( 'Y-m-d H:i:s' );
	}
}

