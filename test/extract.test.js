import assert from 'assert';
import extract from '../src/extract';

describe('extract', () => {
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
  };

  const query = `
    1: {
      first,
      second: {
        two,
        four: {
          val
        }
      }
    },
    2: {
      third
    }
  `;

  const filteredData = {
    1: {
      first: 'One',
      second: {
        two: 'Two',
        four: {
          val: 'Four',
        },
      },
    },
    2: {
      third: 'Tre',
    },
  };

  it('should return the expected shape', () => {
    const { result } = extract(query).from(data);
    assert.deepEqual(result, filteredData);
  });

  it('should return the selected top level keys', () => {
    const { result } = extract(`1, 2`).from(data);
    assert.deepEqual(result, data);
  });

  it('should return the selected top level keys', () => {
    const { result } = extract(`{1, 2}`).from(data);
    assert.deepEqual(result, data);
  });
});
