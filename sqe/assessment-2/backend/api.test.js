const { test } = require('@jest/globals');

const api = require('./api');

test('exports an Express app', () => {
  expect(typeof api === 'function').toBeTruthy();
});
