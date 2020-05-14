<?php require_once 'partials/header.php'; ?>

<body>
	<?php require_once 'partials/hero.php'; ?>

	<main class="container" style="padding: 60px 0;">
		<div class="box">
			<h3 class="title is-3 is-spaced">WordPress Versions</h3>

			<div class="field is-grouped is-grouped-multiline">
				<?php foreach ( $config->version as $version ) : ?>
					<div class="control">
						<div class="tags has-addons">
							<?php if ( $version->valid ) { ?>
								<a target="_blank" href="https://wordpress.org/support/wordpress-version/version-<?php echo esc_html( str_replace( '.', '-', $version->ver ) ); ?>/ " class="tag is-medium is-success"><?php echo esc_html( $version->ver ); ?></a>
							<?php } else { ?>
								<span class="tag is-medium is-danger"><?php echo esc_html( $version->ver ); ?></span>
								<span class="tag is-medium is-danger is-light">Invalid version.</span>
							<?php } ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="box">
			<h3 class="title is-3 is-spaced">Plugins</h3>

			<?php if ( empty( $config->plugins ) ) { ?>
				<p class="subtitle">Add plugins to the <code>cypress.json</code> configuration.</p>
			<?php } else { ?>

				<?php $validated_plugins = Validation::validate_plugins( $config->plugins ); ?>

				<table class="table is-striped is-fullwidth">
					<thead>
						<tr>
							<th>Name</th>
							<th>Valid</th>
							<th>Path</th>
						</tr>
					</thead>
					<tbody>
					<?php foreach ( $validated_plugins as $plugin ) : ?>
						<tr>
							<td style="width: 25%;"><?php echo esc_html( $plugin['name'] ); ?></td>
							<td style="width: 25%;">
						<?php if ( $plugin['valid'] ) { ?>
							<span class="icon has-text-success">
								<i class="fas fa-check-square"></i>
							</span>
						<?php } ?>
						<?php if ( ! $plugin['valid'] ) { ?>
							<span class="icon has-text-danger">
								<i class="fas fa-ban"></i>
							</span>
							<span class="has-text-danger"><?php echo esc_html( $plugin['message'] ); ?></span>
						<?php } ?>
							</td>
							<td style="width: 50%;"><code class="is-primary"><?php echo esc_html( $plugin['path'] ); ?></code></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
			<?php } ?>
		</div>

		<div class="box">
			<div class="level">
				<h3 class="title is-3 is-spaced is-marginless">Themes</h3>

				<div class="tags has-addons">
					<span class="tag is-info">Active Theme</span>
					<span class="tag is-info is-light"><?php echo esc_html( Validation::active_theme_name() ); ?></span>
				</div>
			</div>

			<?php if ( empty( $config->themes ) ) { ?>
				<p class="subtitle">Add themes to the <code>cypress.json</code> configuration.</p>
			<?php } else { ?>
				<table class="table table is-striped is-fullwidth">
					<thead>
						<tr>
							<th>Name</th>
							<th>Valid</th>
							<th>Path</th>
						</tr>
					</thead>
					<tbody>
					<?php foreach ( $config->themes as $theme ) : ?>
						<tr>
							<td style="width: 25%;"><?php echo esc_html( $theme->name ); ?></td>
							<td style="width: 25%;">
						<?php $theme_validation = Validation::validate_theme( $theme->name ); ?>
						<?php if ( $theme_validation['valid'] ) { ?>
							<span class="icon has-text-success">
								<i class="fas fa-check-square"></i>
							</span>
						<?php } ?>
						<?php if ( ! $theme_validation['valid'] ) { ?>
							<span class="icon has-text-danger">
								<i class="fas fa-ban"></i>
							</span>
							<span class="has-text-danger"><?php echo $theme_validation['message']; //phpcs:ignore ?></span>
						<?php } ?>
							</td>
							<td style="width: 50%;"><code><?php echo esc_html( $theme->path ); ?></code></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
			<?php } ?>
		</div>

		<div class="box">
			<h3 class="title is-3 is-spaced">WP Config</h3>

			<?php if ( ! isset( $config->config ) ) { ?>
				<p class="subtitle">Add wp config values to the <code>cypress.json</code> configuration.</p>
			<?php } ?>

			<?php if ( isset( $config->config ) ) { ?>
				<table class="table table is-striped is-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $config->config as $key => $value ) : ?>
							<tr>
								<td><?php echo esc_html( $key ); ?></td>
								<td>
									<code>
										<?php
										if ( is_bool( $value ) ) {
											echo $value ? 'true' : 'false';
										} else {
											echo esc_html( $value );
										}
										?>
									</code>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php } ?>
		</div>
	</main>

<?php require_once 'partials/footer.php'; ?>
