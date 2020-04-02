<?php

add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'disable-tooltips.js',
		plugins_url( '/assets/disable-tooltips.js', dirname( __FILE__ ) ),
		[],
		filemtime( __DIR__ . '/assets/disable-tooltips.js' ),
		true
	);
} );
