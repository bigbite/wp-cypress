#!/bin/bash

if [ "$INIT_CWD" == "$(pwd)" ]; then
  exit 0
fi

cd $INIT_CWD

if [ ! -d ./cypress ]; then
  mkdir cypress
fi

cd cypress

if [ ! -d ./seeds ]; then
  mkdir seeds
  cd seeds
  cat > Init.php <<EOF
<?php

use WP_Cypress\Seeder\Seeder;

class Init extends Seeder {
	public function run() {
		\$title = \$this->faker->sentence();
		\$this->generate->posts( [ 'post_title' => \$title ], 1 );
	}
}

EOF
fi

exit 0
