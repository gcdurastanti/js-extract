
// js-extract v3.0.0 - unified implementation
function isString(x) { return typeof x === 'string'; }
function isObject(x) { return x && typeof x === 'object' && !Array.isArray(x); }
function isArray(x) { return Array.isArray(x); }

function parseStringQuery(query) {
  // Legacy string query parser (copied from v2)
  // ...existing code...
  // For consolidation, you may want to move the v2 parseBlock logic here
  // For now, fallback to v2 logic
  // Remove whitespace and normalize
  let normalized;
  try {
    normalized = query.replace(/\r?\n|\r|\s/g, '');
    const open = (normalized.match(/{/g) || []).length;
    const close = (normalized.match(/}/g) || []).length;
    if (open !== close) throw new Error('Unbalanced brackets');
  } catch (e) {
    return [];
  }
  // Use v2 parseBlock logic
  // ...existing code...
  // For now, import from extract.v3.js if needed
  // But since we're consolidating, you can copy the parseBlock logic here
  // For now, let's assume parseBlock is available
  return parseBlock(normalized);
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

// v2 string query parser logic
function parseBlock(block) {
  let selectors = [];
  if (!block || block.length === 0) {
    return selectors;
  } else if (!block.includes(':')) {
    return block.replace(/({|})/g, '').split(',');
  }
  const parts = block.split('');
  const length = parts.length;
  let index = -1;
  while (index++ < length) {
    const indices = [
      { token: ':', index: block.nextIndexOf(':', index) },
      { token: ',', index: block.nextIndexOf(',', index) },
      { token: '{', index: block.nextIndexOf('{', index) },
      { token: '}', index: block.nextIndexOf('}', index) },
    ];
    const filtered = indices.filter(val => val.index >= 0);
    const min = filtered.length
      ? filtered.reduce((a, b) => (a.index < b.index ? a : b))
      : null;
    if (min && min.token === ':') {
      const openBracketIndex = min.index + 1;
      const topKey = block.substring(index, min.index).replace(',', '');
      const blockEnd = findClosingBracketMatchIndex(block, openBracketIndex);
      const keys = block.substring(openBracketIndex + 1, blockEnd).split(',');
      const subKeys = parseBlock(
        keys.filter(key => key.includes(':') || key.includes('}')).join(',')
      );
      const mapper = key => `${topKey}.${key}`;
      selectors.push(...keys.map(mapper), ...subKeys.map(mapper));
      index = blockEnd;
    } else if (min && min.token === ',' && min.index !== index) {
      const selector = block.substring(index, min.index);
      selectors.push(selector);
      index = min.index;
    } else if (!min) {
      selectors.push(block.substring(index, parts.length).replace(',', ''));
      break;
    }
  }
  const flatten = arr => arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );
  return flatten(selectors.filter(selector => !selector.includes(':')));
}

function findClosingBracketMatchIndex(str, pos) {
  if (str[pos] != '{') {
    throw new Error("No '{' at index " + pos);
  }
  let depth = 1;
  let index = pos + 1;
  const length = str.length;
  while (index++ < length) {
    switch (str[index]) {
      case '{':
        depth++;
        break;
      case '}':
        if (--depth == 0) {
          return index;
        }
        break;
    }
  }
  return -1;
}

Object.defineProperty(String.prototype, 'nextIndexOf', {
  value(character, currentIndex) {
    const index = this.slice(currentIndex).indexOf(character);
    return index >= 0 ? index + currentIndex : -1;
  },
});

export default extract;
