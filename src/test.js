import extract from './extract';

const data = {
  one: {
    num: 1,
    str: 'one',
  },
  two: {
    num: 2,
    str: 'two',
  },
  three: {
    num: 3,
    str: 'three',
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

const { result } = extract(query)
  .from(data)
  .where('*.str', val => val.length === 3);
