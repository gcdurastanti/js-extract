// js-extract v3.0.0 - initial implementation
// Supports string, object, and array queries

function isString(x) { return typeof x === 'string'; }
function isObject(x) { return x && typeof x === 'object' && !Array.isArray(x); }
function isArray(x) { return Array.isArray(x); }

import extractV2 from './extract';

function parseStringQuery(query) {
  // Use v2 to parse selectors from string query
  return extractV2(query).selectors;
}

function parseObjectQuery(query) {
  // Convert object query to array of paths
  const paths = [];
  function walk(obj, prefix = []) {
    Object.entries(obj).forEach(([key, value]) => {
      if (isArray(value)) {
        value.forEach(v => {
          if (isString(v)) {
            paths.push([...prefix, key, v].join('.'));
          } else if (isObject(v)) {
            walk(v, [...prefix, key]);
          }
        });
      } else if (isObject(value)) {
        walk(value, [...prefix, key]);
      } else if (isString(value)) {
        paths.push([...prefix, key, value].join('.'));
      }
    });
  }
  walk(query);
  return paths;
}

function parseArrayQuery(query) {
  // Array of dot notation paths
  return query;
}


const memoCacheObj = new WeakMap();
const memoCachePrim = new Map();


function buildResult(selectors, data, mapFn, filterFn) {
  const result = {};
  selectors.forEach(path => {
    const parts = path.split('.');
    let ref = data;
    let valid = true;
    for (const part of parts) {
      if (ref && typeof ref === 'object' && part in ref) {
        ref = ref[part];
      } else {
        valid = false;
        break;
      }
    }
    if (valid) {
      let value = ref;
      if (mapFn) value = mapFn(value);
      if (filterFn && !filterFn(value)) return;
      let resRef = result;
      parts.forEach((p, i) => {
        if (i === parts.length - 1) {
          resRef[p] = value;
        } else {
          if (!(p in resRef)) resRef[p] = {};
          resRef = resRef[p];
        }
      });
    }
  });
  return result;
}

function extract(query) {
  let selectors;
  if (isString(query)) {
    selectors = parseStringQuery(query);
  } else if (isObject(query)) {
    selectors = parseObjectQuery(query);
  } else if (isArray(query)) {
    selectors = parseArrayQuery(query);
  } else {
    throw new Error('Invalid query format');
  }

  let mapFn = null;
  let filterFn = null;

  const api = {
    selectors,
    map(fn) {
      mapFn = fn;
      return api;
    },
    filter(fn) {
      filterFn = fn;
      return api;
    },
    from(data) {
      // Memoization only for untransformed results
      if (!mapFn && !filterFn) {
        let cacheForQuery;
        let isObj = isObject(query);
        if (isObj) {
          cacheForQuery = memoCacheObj.get(query);
          if (!cacheForQuery) {
            cacheForQuery = new WeakMap();
            memoCacheObj.set(query, cacheForQuery);
          }
          if (cacheForQuery.has(data)) {
            return cacheForQuery.get(data);
          }
        } else {
          const key = JSON.stringify(query);
          cacheForQuery = memoCachePrim.get(key);
          if (!cacheForQuery) {
            cacheForQuery = new WeakMap();
            memoCachePrim.set(key, cacheForQuery);
          }
          if (cacheForQuery.has(data)) {
            return cacheForQuery.get(data);
          }
        }
        const result = buildResult(selectors, data);
        cacheForQuery.set(data, result);
        return result;
      }
      // No memoization for transformed results
      return buildResult(selectors, data, mapFn, filterFn);
    }
  };
  return api;
}

export default extract;
