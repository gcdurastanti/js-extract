"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// };
const where = data => (match, validator) => {
  let result = {};
  const value = data['one.str'];

  _lodash.default.forIn(data, (value, key) => {
    console.log(value, key);
  });

  return result;
};

var _default = where;
exports.default = _default;
//# sourceMappingURL=where.js.map