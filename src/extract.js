// Removed lodash imports. Using native JS alternatives below.

// extend String so we can find the next index of a character
Object.defineProperty(String.prototype, 'nextIndexOf', {
  value(character, currentIndex) {
    const index = this.slice(currentIndex).indexOf(character);
    return index >= 0 ? index + currentIndex : -1;
  },
});

const findClosingBracketMatchIndex = (str, pos) => {
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
  return -1; // No matching closing bracket
};

const parseBlock = block => {
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

      // set loop index to end of this block since the recursion has handled it
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

  // Native deep flatten implementation
  const flatten = arr => arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );
  return flatten(selectors.filter(selector => !selector.includes(':')));
};

// Enhanced pick implementation for nested selectors
// Improved pickNested: only include explicitly requested nested keys
const pickNested = (obj, selectors) => {
  if (!selectors || selectors.length === 0) return {};
  const result = {};
  // Group selectors by their top-level key
  const grouped = {};
  selectors.forEach(sel => {
    if (!sel) return;
    const parts = sel.split('.').filter(Boolean);
    if (parts.length === 0) return;
    const top = parts[0];
    if (!grouped[top]) grouped[top] = [];
    if (parts.length > 1) grouped[top].push(parts.slice(1).join('.'));
  });
  Object.entries(grouped).forEach(([key, subSelectors]) => {
    if (obj && typeof obj === 'object' && key in obj) {
      if (subSelectors.length === 0) {
        result[key] = obj[key];
      } else if (obj[key] && typeof obj[key] === 'object') {
        const subResult = pickNested(obj[key], subSelectors);
        // Only include parent if subResult is not empty
        if (Object.keys(subResult).length) {
          result[key] = subResult;
        }
      }
      // If parent exists but is not an object, do not include in result
    }
    // If key is missing in obj, do not include in result
  });
  return result;
};

const from = selectors => data => {
  return pickNested(data, selectors);
};

const extract = query => {
  let normalized;
  try {
    // Remove whitespace and normalize
    normalized = query.replace(/\r?\n|\r|\s/g, '');
    // Basic bracket balance check
    const open = (normalized.match(/{/g) || []).length;
    const close = (normalized.match(/}/g) || []).length;
    if (open !== close) throw new Error('Unbalanced brackets');
  } catch (e) {
    // Return empty selectors and a no-op from function
    return {
      selectors: [],
      from: () => ({}),
    };
  }
  const selectors = parseBlock(normalized);
  return {
    selectors,
    from: from(selectors),
  };
};

export default extract;
