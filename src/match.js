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
function match(path, pattern) {
  const patterns = pattern.split('/');
  return path.map((fragment, i) => {
    const expr = patterns[i + 1];
    if (expr === '*') {
      // the any expression matches anything
      return true;
    }
    if (!expr) {
      // not having an expression matches, too
      return true;
    }
    if (fragment === expr) {
      // exact matches are ok as well
      return true;
    }
    // else reject
    return false;
  }).reduce((p, v) => p && v, true);
}
exports.match = match;
