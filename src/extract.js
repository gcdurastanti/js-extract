import _ from 'lodash';

// extend String so we can find the next index of a character
Object.defineProperty(String.prototype, 'nextIndexOf', {
  value(character, currentIndex) {
    const index = this.slice(currentIndex).indexOf(character);
    return index > 0 ? index + currentIndex : 0;
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

  if (_.isEmpty(block)) {
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
    const min = _.minBy(indices.filter(val => val.index > 0), 'index');

    if (min && min.token === ':') {
      const openBracketIndex = min.index + 1;
      const topKey = block.substring(index, min.index).replace(',', '');
      const blockEnd = findClosingBracketMatchIndex(block, openBracketIndex);

      const keys = block.substring(openBracketIndex + 1, blockEnd).split(',');

      const subKeys = parseBlock(keys.filter(key => key.includes(':')).join(','));
      const mapper = key => `${topKey}.${key}`;

      selectors.push(...keys.map(mapper), ...subKeys.map(mapper));

      // set loop index to end of this block since the recursion has handled it
      index += blockEnd;
    } else if (min && min.token === ',') {
      const selector = block.substring(index, min.index);
      selectors.push(selector);
      index += min.index;
    } else if (!min) {
      selectors.push(block.substring(index, parts.length).replace(',', ''));
      break;
    }
  }

  return _.flattenDeep(selectors.filter(selector => !selector.includes(':')));
};

const from = selectors => data => {
  const result = _.pick(data, selectors);

  return {
    result,
  };
};

const extract = query => {
  const normalized = query.replace(/\r?\n|\r|\s/g, '');
  const selectors = parseBlock(normalized);

  return {
    selectors,
    from: from(selectors),
  };
};

export default extract;
