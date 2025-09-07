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

const query = `1: { first, second: { two } }, 2: { third }`;
const result = extract(query).from(data);
// result: { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } }
```

## Query Syntax

- Select top-level keys: `1, 2`
- Select nested keys: `1: { first, second: { two } }`
- Select multiple keys: `1, 2, 3`
- Whitespace and newlines are ignored.

### Edge Cases
- Non-existent keys are ignored.
- Missing nested objects return empty objects.

## Features

- No dependencies
- Minified build for small published size
- Supports deep extraction

## Contributing & Testing

Clone the repo and run:

```sh
npm test
```

## Compatibility

- Node.js >= 12
- ESM and CommonJS supported
# js-extract

Fancy extractor for js objects that is like destructuring but safer.

## Install

`npm install --save @gdurastanti/js-extract`

## Use

`import extract from @gdurastanti/'js-extract'`

OR

`var extract = require('@gdurastanti/js-extract').default`

### Example

```javascript
const data = {
  one: {
    num: 1,
    str: 'one',
    foo: {
      bar: 'baz',
    },
  },
  two: {
    num: 2,
    str: 'two',
    foo: {
      bar: 'baz',
    },
  }
};

const selector = `
  one: {
    str
  },
  two: {
    num,
    foo
  }
`

extract(selector).from(data);
```

**Result:**

```javascript
{
  one: {
    str: 'one'
  },
  two: {
    num: 2,
    foo: {
      bar: 'baz'
    }
  }
}
```
