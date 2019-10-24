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

const traverse = require('traverse');
const { match } = require('./match');


function findPreload(obj, fields) {
  const preloads = [];

  if (fields.length === 0) {
    return preloads; // nothing to preload, we can skip
  }
  traverse(obj).forEach(function handle(value) {
    const matches = fields.filter((pattern) => match(this.path, pattern)).length;
    if (matches && typeof value === 'string') {
      preloads.push(value);
    }
  });
  return preloads;
}

function extractPreload(headers) {
  if (headers.preload && Array.isArray(headers.preload)) {
    return headers.preload;
  } else if (headers.preload) {
    return [headers.preload];
  }
  return []; // nothing to preload
}

function wrapPreload(fn) {
  return async (params) => {
    const retval = await fn(params);
    const fields = params && params.__ow_headers ? extractPreload(params.__ow_headers) : [];
    if (retval.headers || retval.statusCode) {
      if (!retval.headers) {
        retval.headers = {};
      }
      const preloads = findPreload(retval.body, fields).map((preload) => `<${preload}>; rel=preload;`);
      if (preloads.length > 0 && retval.headers.link && typeof retval.headers.link === 'string') {
        retval.headers.link = [retval.headers.link, ...preloads].join(' ');
      } else if (preloads.length > 0 && retval.headers.link && Array.isArray(retval.headers.link)) {
        retval.headers.link = [...retval.headers.link, ...preloads];
      } else if (preloads.length > 0) {
        retval.headers.link = preloads.join(' ');
      }
    }
    return retval;
  };
}

module.exports = { wrapPreload, findPreload };
