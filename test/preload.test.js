/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env mocha */

const assert = require('assert');
const { findPreload, wrapPreload } = require('../src/preload.js');

describe('Test Find Preload', () => {
  it('findPreload finds html Preloads', () => {
    const result = findPreload({
      foo: '/bla.html',
      bar: '/baz.json',
    }, [
      '/foo',
    ]);

    assert.deepEqual(result, ['/bla.html']);
  });

  it('findPreload finds json Preloads', () => {
    const result = findPreload({
      foo: '/bla.html',
      bar: '/baz.json',
    }, [
      '/bar',
    ]);

    assert.deepEqual(result, ['/baz.json']);
  });

  it('findPreload finds no for empty list', () => {
    const result = findPreload({
      foo: '/bla.html',
      bar: '/baz.json',
    }, []);

    assert.deepEqual(result, []);
  });
});

describe('Wrap Tests', () => {
  it('wrap wraps for array headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
      },
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({
      __ow_headers: {
        preload: [
          '/foo',
        ],
      },
    });

    assert.deepEqual(result.headers.link, '</bar.html>; rel=preload;')
  });

  it('wrap wraps for string headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
      },
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({
      __ow_headers: {
        preload: '/foo'
      },
    });

    assert.deepEqual(result.headers.link, '</bar.html>; rel=preload;')
  });

  it('wrap wraps for string headers with existing response', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
      },
      headers: {
        link: '</assets/jquery.js>; rel=preload; as=script'
      }
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({
      __ow_headers: {
        preload: '/foo'
      },
    });

    assert.deepEqual(result.headers.link, '</assets/jquery.js>; rel=preload; as=script </bar.html>; rel=preload;')
  });

  it('wrap wraps for string headers with existing array response', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
      },
      headers: {
        link: ['</assets/jquery.js>; rel=preload; as=script']
      }
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({
      __ow_headers: {
        preload: '/foo'
      },
    });

    assert.deepEqual(result.headers.link, ['</assets/jquery.js>; rel=preload; as=script',  '</bar.html>; rel=preload;'])
  });

  it('wrap skips for missing request headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
        zip: '/bar.json'
      },
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({});

    assert.ok(!result.headers.link)
  });

  it('wrap skips for non-web response', async () => {
    const main = () => ({
    foo: '/bar.html',
    zip: '/bar.json'
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({});

    assert.ok(!result.headers)
  });

  it('wrap skips for empty request headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: {
        foo: '/bar.html',
        zip: '/bar.json'
      },
    });

    const wrapped = wrapPreload(main);

    const result = await wrapped({
        __ow_headers: {
            link: undefined
        }
    });

    assert.ok(!result.headers.link)
  });
});
