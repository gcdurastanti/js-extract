# js-extract

Fancy extractor for js objects that is like destructuring but safer.

## Install

`npm install --save @gdurastanti/js-extract`

## Use

`import extract from @gdurastnati/'js-extract'`

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
