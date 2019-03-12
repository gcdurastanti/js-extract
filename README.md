# js-extract

Fancy extractor for js objects

## Install

`npm install --save js-extract`

## Use

`import extract from 'js-extract'`

OR

`var extract = require('js-extract').default`

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
