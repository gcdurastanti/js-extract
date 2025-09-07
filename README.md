# js-extract

Extract values from JavaScript objects using a simple query syntax.

## Install

```sh
npm install @gdurastanti/js-extract
```

## Usage

```js
import extract from '@gdurastanti/js-extract';

const data = {
  1: { first: 'One', second: { two: 'Two', three: 'Three' } },
  2: { first: 'Uno', second: 'Due', third: 'Tre' },
};

// String query (backward compatible)
const queryStr = `1: { first, second: { two } }, 2: { third }`;
const resultStr = extract(queryStr).from(data);
// resultStr: { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } }

// Object query
const queryObj = { 1: ['first', { second: ['two'] }], 2: ['third'] };
const resultObj = extract(queryObj).from(data);
// resultObj: { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } }

// Array query
const queryArr = [ '1.first', '1.second.two', '2.third' ];
const resultArr = extract(queryArr).from(data);
// resultArr: { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } }
```

## Chainable & Custom API (v3)

Transform or filter extracted values:

```js
const data = { 1: { val: 1 }, 2: { val: 2 }, 3: { val: 3 } };

// Extract all 'val' properties, multiply by 10, then keep only those > 10
const result = extract({ 1: ['val'], 2: ['val'], 3: ['val'] })
  .map(x => x * 10)
  .filter(x => x > 10)
  .from(data);

// result: { 2: { val: 20 }, 3: { val: 30 } }
```

## Query Styles

- **String queries:**
  ```js
  extract('1: { first, second: { two } }, 2: { third }').from(data)
  ```
- **Object queries:**
  ```js
  extract({ 1: ['first', { second: ['two'] }], 2: ['third'] }).from(data)
  ```
- **Array queries:**
  ```js
  extract(['1.first', '1.second.two', '2.third']).from(data)
  ```

### Edge Cases
- Non-existent keys are ignored.
- Missing nested objects return empty objects.
- Invalid query formats throw clear errors.


