import extract from './extract';

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
  },
  three: {
    num: 3,
    str: 'three',
    foo: {
      bar: 'baz',
    },
  },
};

const simple = {
  one: 'one',
  two: 'two',
  three: 'three',
};

const query = `
    one,
    two,
    three
  `;

const result = extract(query).from(data);
