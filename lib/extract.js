"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// extend String so we can find the next index of a character
Object.defineProperty(String.prototype, 'nextIndexOf', {
  value(character, currentIndex) {
    const index = this.slice(currentIndex).indexOf(character);
    return index > 0 ? index + currentIndex : 0;
  }

});

const findClosingBracketMatchIndex = (str, pos) => {
  if (str[pos] != '{') {
    throw new Error("No '{' at index " + pos);
  }

  let depth = 1;

  for (let i = pos + 1; i < str.length; i++) {
    switch (str[i]) {
      case '{':
        depth++;
        break;

      case '}':
        if (--depth == 0) {
          return i;
        }

        break;
    }
  }

  return -1; // No matching closing bracket
};

const parseBlock = block => {
  let selectors = [];

  if (_lodash.default.isEmpty(block)) {
    return selectors;
  } else if (!block.includes(':')) {
    return block.replace(/({|})/g, '').split(',');
  }

  const parts = block.split('');

  for (let i = 0; i < parts.length; i++) {
    const indices = [{
      token: ':',
      index: block.nextIndexOf(':', i)
    }, {
      token: ',',
      index: block.nextIndexOf(',', i)
    }, {
      token: '{',
      index: block.nextIndexOf('{', i)
    }, {
      token: '}',
      index: block.nextIndexOf('}', i)
    }];

    const min = _lodash.default.minBy(indices.filter(val => val.index > 0), 'index');

    if (min && min.token === ':') {
      const openBracketIndex = min.index + 1;
      const topKey = block.substring(i, min.index).replace(',', '');
      const blockEnd = findClosingBracketMatchIndex(block, openBracketIndex);
      const keys = block.substring(openBracketIndex + 1, blockEnd).split(',');
      const subKeys = parseBlock(keys.filter(key => key.includes(':')).join(','));

      const mapper = key => `${topKey}.${key}`;

      selectors.push(...keys.map(mapper), ...subKeys.map(mapper)); // set loop index to end of this block since the recursion has handled it

      i += blockEnd;
    } else if (min && min.token === ',') {
      const selector = block.substring(i, min.index);
      selectors.push(selector);
      i += min.index;
    } else if (!min) {
      selectors.push(block.substring(i, parts.length).replace(',', ''));
      break;
    }
  }

  return _lodash.default.flattenDeep(selectors.filter(selector => !selector.includes(':')));
};

const extract = query => {
  const normalized = query.replace(/\r?\n|\r|\s/g, '');
  const selectors = parseBlock(normalized); // const result = _.pick(data, selectors);

  const from = data => ({
    selectors,
    result: _lodash.default.pick(data, selectors)
  });

  return {
    query,
    selectors,
    from
  };
};

var _default = extract;
exports.default = _default;