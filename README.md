## Chainable & Custom API (v3)

You can transform or filter extracted values:

```js
import extract from '@gdurastanti/js-extract';

const data = { 1: { val: 1 }, 2: { val: 2 } };
const result = extract({ 1: ['val'], 2: ['val'] })
  .map(x => x * 10)
  .filter(x => x > 10)
  .from(data);
// result: { 2: { val: 20 } }
```
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


## Query Syntax (v3)

You can use:
- **String queries** (backward compatible):
  - `1: { first, second: { two } }, 2: { third }`
- **Object queries:**
  - `{ 1: ['first', { second: ['two'] }], 2: ['third'] }`
- **Array queries:**
  - `[ '1.first', '1.second.two', '2.third' ]`

### Edge Cases
- Non-existent keys are ignored.
- Missing nested objects return empty objects.
- Invalid query formats throw clear errors.

## Advanced Features (v3)
- TypeScript support
- Multiple query formats
- Improved error handling

## Features

- No dependencies
- Minified build for small published size
- Supports deep extraction

## Contributing & Testing

Clone the repo and run:

```sh
npm test
```

## TypeScript Support

Type definitions are included. Usage:

```ts
import extract from '@gdurastanti/js-extract';

const query: string | object | string[] = ...;
const result = extract(query).from(data); // result is typed
```

## Compatibility

- Node.js >= 12
- ESM and CommonJS supported
- Browser/UMD: use `lib/extract.v3.umd.js`

```html
<script src="lib/extract.v3.umd.js"></script>
<script>
  const result = jsExtract({ 1: ['first'] }).from({ 1: { first: 'One' } });
  console.log(result); // { 1: { first: 'One' } }
</script>
```
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
