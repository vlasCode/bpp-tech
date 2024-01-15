const { test } = require('@jest/globals');

const seed = require('./seed');

test('returns an array', () => {
  expect(Array.isArray(seed)).toBeTruthy();
  expect(seed.length).toBeGreaterThan(0);
});

test('returns 2 lists', () => {
  const lists = seed.filter(r => r?.type === 'list');
  expect(lists.length).toEqual(2);
});
