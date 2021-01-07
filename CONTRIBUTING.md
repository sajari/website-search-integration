# Contributing

## Table of contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Build](#build)
- [Release](#release)

## Prerequisites

Prepare your environment for Node.js. We use [volta](https://volta.sh/) to manage node versions. Follow the [install guide for volta](https://docs.volta.sh/guide/getting-started) to get started.

## Install

```
yarn install
```

## Build

```
yarn build
```

## Release

> **Note:** this step can only be done by the Sajari engineering team.

After [building](#build) the distribution, copy it to the `website` repository.

```
cp dist/website-search-1.4.js /path/to/code.sajari.com/website/appengine/public-assets/js/integrations/
```

Then in the `website` repo, deploy the updated public assets to the CDN.
