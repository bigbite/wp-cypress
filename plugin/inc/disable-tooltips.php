<?php

function disable_tooltips() {
	add_action( 'enqueue_block_editor_assets', function () {
		wp_enqueue_script(
			'wp-cypress-disable-tooltips',
			plugins_url( '/assets/disable-tooltips.js', dirname( __FILE__ ) ),
			[ 'wp-blocks' ],
			filemtime( WP_CYPRESS_PLUGIN . '/assets/disable-tooltips.js' ),
			false
		);
	} );
}
