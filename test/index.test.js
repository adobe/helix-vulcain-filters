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

'use strict';

const assert = require('assert');
const { filter, match, wrap } = require('../src/index.js');

const example = {
  foo: {
    bar: 'baz',
  },
};

const longexample = {
  foo: {
    bar: 'baz',
    remove: 'me',
  },
};

describe('Filter Tests', () => {
  it('filter function passes', async () => {
    const result = filter(example, [
      '/foo/*',
    ]);
    assert.deepEqual(result, example);
  });

  it('filter function filters', async () => {
    const result = filter(longexample, [
      '/foo/bar',
    ]);
    assert.deepEqual(result, example);
  });

  it('filter function skips when no filter defined', () => {
    assert.deepEqual(filter(example), example);
  });
});

describe('Match Tests', () => {
  it('match function rejects', async () => {
    assert.ok(!match(['foo', 'baz'], '/foo/bar'));
    assert.ok(!match(['foo', 'bib'], '/foo/bar'));
    assert.ok(!match(['boo', 'bar'], '/foo/bar'));
    assert.ok(!match(['foo', 'bar', 'zup'], '/foo/*/zip'));
  });

  it('match function accepts', async () => {
    assert.ok(match(['foo', 'baz'], '/foo/baz'));
    assert.ok(match(['foo', 'bib'], '/foo/*'));
    assert.ok(match(['boo', 'bar'], '/boo'));
    assert.ok(match(['foo', 'bar', 'zup'], '/foo/*/zup'));
  });
});

describe('Wrap Tests', () => {
  it('wrap wraps for array headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: longexample,
    });

    const wrapped = wrap(main);

    const result = await wrapped({
      __ow_headers: {
        fields: [
          '/foo/bar',
        ],
      },
    });

    assert.deepEqual(result.body, example);
  });

  it('wrap wraps for string headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: longexample,
    });

    const wrapped = wrap(main);

    const result = await wrapped({
      __ow_headers: {
        fields: '/foo/bar',
      },
    });

    assert.deepEqual(result.body, example);
  });

  it('wrap skips for wrong headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: longexample,
    });

    const wrapped = wrap(main);

    const result = await wrapped({
      __ow_headers: {
        yields: '/foo/bar',
      },
    });

    assert.deepEqual(result.body, longexample);
  });

  it('wrap skips for empty headers', async () => {
    const main = () => ({
      statusCode: 200,
      body: longexample,
    });

    const wrapped = wrap(main);

    const result = await wrapped({ });

    assert.deepEqual(result.body, longexample);
  });

  it('wrap skips for string responses', async () => {
    const main = () => ({
      statusCode: 200,
      body: 'easy',
    });

    const wrapped = wrap(main);

    const result = await wrapped({
      __ow_headers: {
        fields: [
          '/foo/bar',
        ],
      },
    });

    assert.deepEqual(result.body, 'easy');
  });
});
