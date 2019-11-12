# 1.0.0 (2019-11-12)


### Code Refactoring

* **fields:** rename `filter` to `filterFields` ([ffe0d91](https://github.com/adobe/helix-vulcain-filters/commit/ffe0d91))
* **wrap:** rename wrap to wrapFields ([0e95873](https://github.com/adobe/helix-vulcain-filters/commit/0e95873))


### Features

* **index:** implement basic JSON-pointer based field filter that can be used for reducing size of response set in web actions ([88e96a1](https://github.com/adobe/helix-vulcain-filters/commit/88e96a1))
* **preload:** add support for `Preload` request header and server-pushes ([6ae6052](https://github.com/adobe/helix-vulcain-filters/commit/6ae6052)), closes [adobe/helix-home#64](https://github.com/adobe/helix-home/issues/64)


### BREAKING CHANGES

* **fields:** `filter` is now `filterFields`
* **wrap:** the `wrap` function is now exported as `wrapFields`
