"use strict";

var _extract = _interopRequireDefault(require("./extract"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const data = {
  one: {
    num: 1,
    str: 'one'
  },
  two: {
    num: 2,
    str: 'two'
  },
  three: {
    num: 3,
    str: 'three'
  }
};
const query = `
    one,
    two,
    three
  `;
const {
  result
} = (0, _extract.default)(query).from(data).where();
//# sourceMappingURL=test.js.map