<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# software.bz.it

Repository for the [Free Software Lab](https://software.bz.it) website created with [Hugo](https://gohugo.io/).

[![REUSE Compliance](https://github.com/noi-techpark/software-website/actions/workflows/reuse.yml/badge.svg)](https://github.com/noi-techpark/odh-docs/wiki/REUSE#badges)
[![CI/CD](https://github.com/noi-techpark/software-website/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/software-website/actions/workflows/main.yml)

## Table of contents

- [Gettings started](#getting-started)
- [Deployment](#deployment)
- [Docker environment](#docker-environment)
- [Information](#information)

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- [Hugo](https://gohugo.io/)

If you don't want to install all prerequisites directly on your machine and instead use a Docker environment with all prerequisites already installed and configured, you can check out the [Docker environment](#docker-environment) section.

### Source code

Get a copy of the repository:

```bash
git clone git@github.com:idm-suedtirol/freesoftwarelab-website.git
```

Change directory:

```bash
cd freesoftwarelab-website
```

### Development

To start a local webserver that serves the project, simply run the following command:

```bash
hugo server -s src
```

The website will be available at [http://127.0.0.1:1313](http://127.0.0.1:1313). It also recompiles automatically if you make any change to the source code.

## Deployment

To deploy the website, simply run the command `hugo -s src -d ../target` from the root folder of the project. The final version of the website will then be generate inside the `target` folder.

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

The website will be available at [http://127.0.0.1:1313](http://127.0.0.1:1313). It also recompiles automatically if you make any change to the source code.

After finished working you can stop the Docker containers:

```
docker-compose stop
```

## Information

### Support

For support, please contact [info@software.bz.it](mailto:info@software.bz.it).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `master` branch.

- Make sure the tests are passing.

- Create a pull request against the `master` branch.

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/idm-suedtirol/hugo-boilerplate](https://github.com/idm-suedtirol/hugo-boilerplate).

### License

The code in this project is licensed under the Mozilla Public License 2.0 license.
See the LICENSE.md file for more information.

### REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:
```bash
pip install pre-commit
```
Then install the pre-commit hook via the config file by running:
```bash
pre-commit install
```
## Social cards (Open Graph & Twitter)

The Free Software Lab website exposes Open Graph and Twitter metadata so that
links shared on chat tools (e.g. Microsoft Teams) and social networks show a
rich preview (title, description and image).

### Default social card image

The default image used for all pages is:

- **Path:** `src/static/images/freesoftwarelab-og.jpg`
- **Recommended size:** `1200 × 630` px (approx. `1.91:1` aspect ratio)
- **Used by:** both `og:image` (Open Graph) and `twitter:image`

If you just want to update the global social card image:

1. Create/prepare a new image at `1200 × 630` px.
2. Replace the existing file at  
   `src/static/images/freesoftwarelab-og.jpg`  
   (keep the **same file name and path**).
3. Run the site locally with `hugo server -s src` and open  
   `http://localhost:1313` in your browser.
4. Use a social preview browser plugin (e.g. “Social Share Preview”) to verify
   that the new image is picked up correctly.

No template changes are required as long as the file name and path stay the same.

### Page-specific social card image (optional)

Content editors can override the global image for a single page by setting the
`og_image` parameter in the page’s front matter. Example:

```yaml
---
title: "My custom page"
description: "Short description for link previews."
og_image: "/images/my-custom-card.jpg"
---
