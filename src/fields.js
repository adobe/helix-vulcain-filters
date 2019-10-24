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
const pointer = require('json-pointer');
const { match } = require('./match');

function filterFields(obj, fields = []) {
  if (fields.filter((exp) => exp === '*').length > 0 || fields.length === 0) {
    return obj; // nothing to filter for, we can skip
  }

  traverse(obj).forEach(function handle() {
    const matches = fields.filter((pattern) => match(this.path, pattern)).length;
    if (!matches) {
      pointer.remove(obj, `/${this.path.join('/')}`);
    }
  });

  return obj;
}

function extractFields(headers) {
  if (headers.fields && Array.isArray(headers.fields)) {
    return headers.fields;
  } else if (headers.fields) {
    return [headers.fields];
  }
  return ['*']; // allow all
}

function wrapFields(fn) {
  return async (params) => {
    const retval = await fn(params);
    const fields = params && params.__ow_headers ? extractFields(params.__ow_headers) : ['*'];
    if (retval.body && typeof retval.body === 'object') {
      retval.body = filterFields(retval.body, fields);
    }
    return retval;
  };
}

module.exports = { filterFields, wrapFields };
