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
        two,
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
    3: {
      first: 'Uno',
      second: 'Due',
      third: 'Tre',
    },
  };

  it('should return the expected shape', () => {
    const result = extract(query).from(data);
    assert.deepEqual(result, filteredData);
  });

  it('should return the selected top level keys', () => {
    const result = extract(`1, 2, 3`).from(data);
    assert.deepEqual(result, data);
  });

  it('should return the selected top level keys', () => {
    const result = extract(`{1, 2, 3}`).from(data);
    assert.deepEqual(result, data);
  });
  it('should handle empty query', () => {
    const result = extract('').from(data);
    assert.deepEqual(result, {});
  });

  it('should handle empty data', () => {
    const result = extract(query).from({});
    assert.deepEqual(result, {});
  });

  it('should ignore non-existent keys', () => {
    const result = extract('foo,bar').from(data);
    assert.deepEqual(result, {});
  });

  it('should select deeply nested values', () => {
    const deepQuery = `1: { second: { four: { val } } }`;
    const expected = { 1: { second: { four: { val: 'Four' } } } };
    const result = extract(deepQuery).from(data);
    assert.deepEqual(result, expected);
  });

  it('should handle queries with extra whitespace', () => {
    const result = extract(' 1 , 2 , 3 ').from(data);
    assert.deepEqual(result, data);
  });

  it('should handle single key query', () => {
    const result = extract('2').from(data);
    assert.deepEqual(result, { 2: data[2] });
  });

  it('should handle invalid syntax gracefully', () => {
    assert.doesNotThrow(() => extract('1: { first, second: {').from(data));
  });

  it('should handle numeric keys', () => {
    const result = extract('1').from(data);
    assert.deepEqual(result, { 1: data[1] });
  });

  it('should handle missing nested objects', () => {
  const missingNestedQuery = `2: { second: { missing } }`;
  const expected = {};
  const result = extract(missingNestedQuery).from(data);
  assert.deepEqual(result, expected);
  });
});

  git config --global user.email "cvd2261@protonmail.com"
  git config --global user.name "Giancarlo Durastanti"
