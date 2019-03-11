import extract from './extract';

const data = {
  1: {
    first: 'One',
    second: {
      two: 'Two',
      three: 'Three',
      four: {
        val: 'Four',
      },
    },
  },
  2: {
    first: 'Uno',
    second: 'Due',
    third: 'Tre',
  },
  3: {
    first: 'Uno',
    second: 'Due',
    third: 'Tre',
  },
};

const query = `
  1: {
    first,
    second: {
      four: {
        val
      }
    }
  },
  2: {
    third
  },
  3
`;

const { result } = extract(query).from(data);

console.log(result);
