import _ from 'lodash';

// match = *.*.value
// const where = (data, selectors) => (match, validator) => {
//   let result = {};

//   selectors.forEach(selector => {
//     const parts = selector.split('.');
//     const matchParts = match.split('.');

//     const isMatch = (parts, matchParts) => {
//       for (let i = 0; i < parts.length; i++) {
//         if (matchParts[i] !== '*' || matchParts[i] !== parts[i]) {
//           return false;
//         }
//       }
//       return true;
//     };

//     if (parts.length === matchParts.length && isMatch(parts, matchParts)) {
//       const val = _.pick(data, selector);
//       if (validator(val)) {
//         _.set(result, selector, val);
//       }
//     }
//   });

//   return { result };

const buildKeys = (part, data) => {
  let selectors = [];
};

const where = data => (match, validator) => {
  const matchParts = match.split('.');
  let index = -1;
  let length = matchParts.length;

  let selectors = [];

  while (index++ < length) {
    const part = matchParts[index];
    if (part.includes('*')) {
      selectors.push(Object.keys(data).map(key => `${key}${part.replace('*', '')}`));
    } else {
      selectors.push(part);
    }
  }

  return result;
};

export default where;
