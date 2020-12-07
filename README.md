# Helix Vulcain Filters

> Vulcain-like fields filters for OpenWhisk web actions

## Status
[![codecov](https://img.shields.io/codecov/c/github/adobe/helix-vulcain-filters.svg)](https://codecov.io/gh/adobe/helix-vulcain-filters)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/helix-vulcain-filters.svg)](https://circleci.com/gh/adobe/helix-vulcain-filters)
[![GitHub license](https://img.shields.io/github/license/adobe/helix-vulcain-filters.svg)](https://github.com/adobe/helix-vulcain-filters/blob/main/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/helix-vulcain-filters.svg)](https://github.com/adobe/helix-vulcain-filters/issues)
[![LGTM Code Quality Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/adobe/helix-vulcain-filters.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/adobe/helix-vulcain-filters)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Background

[Vulcain](https://github.com/dunglas/vulcain) is a protocol using HTTP/2 Server Push to create fast and idiomatic client-driven REST APIs. It uses a combination of the `Fields` and `Preload` request headers to enable clients to restrict the fields they want to get in a JSON response (`Fields`) and request server pushes for linked hypermedia resources (`Preload`).

The Vulcain repository linked above contains a reference implementation and describes the spec. **Helix Vulcain Filters** is an implementation of the spec that is not re-using any code of the reference implementation to make it usable in a serverless environment using Apache OpenWhisk and Fastly.

### Architecture

**Helix Vulcain Filters** provides two wrapper functions that implement key parts of the Vulcain protocol. 

The `wrapFields` function takes an existing OpenWhisk `main` function and returns a new function that implements the `Fields` header-based filtering of JSON responses.

The `wrapPreload` function takes an existing OpenWhisk `main` function and returns a new function that implements the `Preload` header-based pushing of related resources. The `wrapPreload` function does that by adding a `Link` header with a `rel=preload` value for every resource that should be pushed. It relies on Fastly to [perfom the actual HTTP2 server push](https://docs.fastly.com/en/guides/http2-server-push).

## Installation

```bash
$ npm install -S @adobe/helix-vulcain-filters
```

## Usage

Add this to your main function:

```javascript
const { wrapFields, wrapPreload } = require('@adobe/helix-vulcain-filters');

function main(params) {
    return {
        statusCode: 200,
        body: {
            hello: params.name || world,
            more: '/foo.json'
        }
    }
}

module.exports.main = wrapFields(wrapPreload(main));
```

The wrappers only operate on:

- web actions
- that have JSON responses
- when either the `Preload` or `Fields` headers are set

Note: as usual in OpenWhisk, the headers are case-insensitive.

## Development

### Build

```bash
$ npm install
```

### Test

```bash
$ npm test
```

### Lint

```bash
$ npm run lint
```
