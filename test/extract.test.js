
import assert from 'assert';
import extract from '../src/extract';

describe('extract', () => {
  const data = {
    1: { first: 'One', second: { two: 'Two', three: 'Three' } },
    2: { first: 'Uno', second: 'Due', third: 'Tre' },
  };

  it('should support string queries (backward compatible)', () => {
    const query = '1: { first, second: { two } }, 2: { third }';
    const result = extract(query).from(data);
    assert.deepEqual(result, { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } });
  });

  it('should support object queries', () => {
    const query = { 1: ['first', { second: ['two'] }], 2: ['third'] };
    const result = extract(query).from(data);
    assert.deepEqual(result, { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } });
  });

  it('should support array queries', () => {
    const query = [ '1.first', '1.second.two', '2.third' ];
    const result = extract(query).from(data);
    assert.deepEqual(result, { 1: { first: 'One', second: { two: 'Two' } }, 2: { third: 'Tre' } });
  });

  it('should ignore non-existent keys', () => {
    const query = { 1: ['foo'], 2: ['bar'] };
    const result = extract(query).from(data);
    assert.deepEqual(result, {});
  });

  it('should handle missing nested objects', () => {
    const query = { 2: [{ second: ['missing'] }] };
    const result = extract(query).from(data);
    assert.deepEqual(result, {});
  });

  it('should throw on invalid query format', () => {
    assert.throws(() => extract(123).from(data), /Invalid query format/);
  });
});

describe('extract chainable & custom API', () => {
  const data = { 1: { val: 1 }, 2: { val: 2 }, 3: { val: 3 } };

  it('should support .map() to transform extracted values', () => {
    const result = extract({ 1: ['val'], 2: ['val'] })
      .map(x => x * 10)
      .from(data);
    assert.deepEqual(result, { 1: { val: 10 }, 2: { val: 20 } });
  });

  it('should support .filter() to filter extracted values', () => {
    const result = extract({ 1: ['val'], 2: ['val'], 3: ['val'] })
      .filter(x => x > 1)
      .from(data);
    assert.deepEqual(result, { 2: { val: 2 }, 3: { val: 3 } });
  });
});

describe('extract performance', () => {
  const largeData = {};
  for (let i = 0; i < 10000; i++) {
    largeData[i] = { val: i, nested: { deep: i * 2 } };
  }

  it('should extract from large datasets quickly', () => {
    const query = { 9999: ['val', { nested: ['deep'] }] };
    const start = Date.now();
    const result = extract(query).from(largeData);
    const duration = Date.now() - start;
    assert.deepEqual(result, { 9999: { val: 9999, nested: { deep: 19998 } } });
    assert(duration < 100, `Extraction took too long: ${duration}ms`);
  });

  it('should memoize repeated queries for speed', () => {
    const query = { 8888: ['val'] };
    const firstStart = Date.now();
    extract(query).from(largeData);
    const firstDuration = Date.now() - firstStart;
    const secondStart = Date.now();
    extract(query).from(largeData);
    const secondDuration = Date.now() - secondStart;
    assert(secondDuration <= firstDuration, 'Memoization did not improve speed');
  });
});
