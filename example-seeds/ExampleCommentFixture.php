<?php

use  WP_Cypress\Fixtures\Fixture;
use  WP_Cypress\Utils;

class ExampleCommentFixture extends Fixture {
	/**
	 * Gets default values of the comment.
	 *
	 * @return array
	 */
	public function defaults(): array {
		return [
			'comment_post_ID'      => 1,
			'comment_author'       => 'admin',
			'comment_author_email' => 'admin@test.com',
			'comment_content'      => 'This is an example comment fixture',
			'user_id'              => 1,
			'comment_date'         => Utils\now(),
		];
	}

	/**
	 * Generates a comment record.
	 *
	 * @return void
	 */
	public function generate(): void {
		$id = (int) wp_insert_comment( array_merge( $this->defaults(), $this->properties ) );
	}
}
