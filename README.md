# WP Cypress

## Contents

- [Why](#why)
- [Requirements](#requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [CLI](#cli)
  - [Env](#env) 
  - [Cypress](#cypress)
  - [Seeds](#seeds)
- [API](#api)
  - [Commands](#commands)
  - [Seeder](#seeder)

## Why?

Cypress is designed to address the pain points of testing modern web applications. WP Cypress extends Cypress to address specific pain points developers and QA engineers face when testing WordPress applications. 

We make it easier to:

- Create a WordPress environment for testing
- Seed the database with test data
- Perform WordPress specific actions when writing tests

## Requirements

- Yarn
- Node
- Docker
- Cypress

## Installation

1. Install cypress

```sh
yarn add cypress --dev
```
2. Initialize Cypress

```sh
yarn run cypress open
```
3. Install WP Cypress

```sh
yarn add @bigbite/wp-cypress --dev
```
4. Import WP Cypress in `/cypress/support/index.js` 

```javascript
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@bigbite/wp-cypress';
```

5. Update `/cypress.json` with your environment variables.

```json
{
  "baseUrl": "http://localhost",
  "pageLoadTimeout": 30000,
  "wp": {
    "version": "5.3.2",
    "plugins": [
      "./"
    ],
    "themes": []
  }
}

```

## Getting Started

### CLI

WP Cypress has been installed to your `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`.

The available commands are now available to run in your project root directory:

Name |  Description | Example
--- | --- | ---
start | Starts a test environment | `yarn run wp-cypress start`
stop | Stops a running test environment | `yarn run wp-cypress stop`
wp | Execute the WordPress CLI in the running container | `yarn run wp-cypress wp "cli version"`
resetDB | Restore the database in the running container to it's initial state | `yarn run wp-cypress resetDB`

> Stuck? Try running `yarn run wp-cypress --help` 

### Env

To start the test environment run `yarn run wp-cypress start` in your project root directory.

This may take a while as it builds and starts a new docker container. However, you only need to run this once. This commands also acts as a restart, firstly removing any containers and volumes before starting the docker container.

> Having trouble? Use File sharing to allow local directories on the Mac to be shared with Linux containers. See more https://docs.docker.com/docker-for-mac/#file-sharing

Once it is running there is no need to re-start it every time you run cypress. WP Cypress will restore the database to its initial state between each suite of integration tests to ensure a clean slate between tests.

You can add environment variables to the `cypress.json` configuration file. You can use this to specify the version of WordPress and which plugins/themes to install. All plugins will be activated and the first theme in the list will be activated. If this file is changed, you will need to re-run `wp-cypress start` to see the changes take effect. Composer is recommended to manage plugins and themes to if they do not exist in your project directory.

###### cypress.json
```json
{
  "baseUrl": "http://localhost",
  "pageLoadTimeout": 30000,
  "wp": {
    "version": "5.4", 
    "plugins": [ 
      "./"
      "./absolute/path/to/plugin"
    ],
    "themes": [
      "../themes/absolute/path/to/theme"
    ]
  }
}

```

An additional plugin will be installed that contains some of the logic that drives the functionality in this package.

### Seeds

In the `cypress` directory there a directory specfic to wp-cypress named `seeds`. Here lives our seeds, which we can use to populate the database with data. By default there will already be one Seed: `Init`. As it's name suggests, this will be ran when the container is initialised and therefore is a good place to create most data. Using the `resetDB` command will reset the database and run the `Init` seed again.

Seeds executed in the running container allowing you to perform any required logic you need to set up your environment. Alongside this there are some helpful tools to help generate dummy data.

If you wish to add more seeds, any file in the `seeds` directory is autoloaded to be executed at a later date using `wp seed ClassName` in the running container or alternatively using the seed command `cy.seedDB('ClassName')`. 

#### Example

###### /wp-cypress/seeds/MySeeder.php
```php
<?php

use \WP_Cypress\Seeder\Seeder;

class MySeeder extends Seeder {
	public function run() {
    $title = $this->faker->sentence();

		$this->generate->posts( [
			'post_title' => $title,
			'import_id'  => 10,
    ], 1 );
    
    $this->generate->comments( [
			'comment_post_ID' => 20,
		], 10 );
	}
}
```
> The file's name must match the name of the class.


### Cypress

Now you can begin writing tests! To learn more about writing tests with cypress visit their documentation on how to [Write Your First Test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file). This package extends cypress with some additional commands that may be useful, please refer to the [API below](#api).

## API

### Commands

#### General

Command | Description | Example
--- | --- | ---
wp(command) | Execute the WP CLI in the running container | `cy.wp('cli version')`
seedDB(seed) | Run a seeder | `cy.seedDB('SeedName')` 
resetDB() | Restore the database to it's initial state | `cy.resetDB()`
installTheme(name) | Install a theme | `cy.installTheme('my-theme')`
activateTheme(name) | Activate a theme | `cy.activateTheme('my-theme')`
installPlugin(name) | Install a plugin | `cy.installPlugin('my-plugin')`
activatePlugin(name) | Active a plugin | `cy.activatePlugin('my-plugin')`
deactivatePlugin(name) | Deactivate a plugin | `cy.deactivatePlugin('my-plugin')`
visitAdmin() | Visit the WordPress admin panel | `cy.visitAdmin()`

#### DOM

Command | Description | Example
--- | --- | ---
setSelection(text) | If a text input is active, set the selection. | `cy.get('.element').click().setSelection('selection')`

#### Post

Command | Description | Example
--- | --- | ---
editPost(id) | Visit the a post's edit page | `cy.editPost(1)`
saveCurrentPost() | If on a post's edit page, save the psot | `cy.saveCurrentPost()`



## Seeder

### Namespace

`\WP_Cypress\Seeder`

---

### abstract class Seeder implements [SeederInterface](#interface-seederinterface)

#### Traits

Trait | Description
--- | ---
[Date](#trait-date) | Shared helper methods for dates

#### Properties

Property |  Description
--- | ---
protected $generate | Reference to a [Generator](#class-generator) instance
protected $faker | Reference to a Faker\Generator instance, see [Faker docs](https://github.com/fzaninotto/Faker#create-fake-data)

#### Methods

Method |  Description | Return | From
--- | --- | --- | ---
now() | Get the current date in `Y-m-d H:i:s` format | string  | [Date](#trait-date)

---
### interface SeederInterface

#### Methods

Method |  Description | Return
--- | --- | ---
run() | Executes when seeded | void

---

### trait Date 

#### Methods

Method |  Description | Return
--- | --- | ---
now() | Get the current date in `Y-m-d H:i:s` format | string

---
### class Generator

#### Methods

Method |  Description | Return
--- | --- | ---
posts( array $properties, number $count ) | Generate posts with dummy data | void
comments( array $properties, number $count ) | Generate comments with dummy data | void









