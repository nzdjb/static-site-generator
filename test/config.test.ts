import { Article } from '../src/article.js';
import { Config } from '../src/config.js';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { describe, test } from 'node:test';
import { deepEqual } from 'node:assert';

await describe('loadConfig', async () => {
  await test('single dir', () => {
    const c = new Config(['test/inputs']);
    deepEqual(
      new Set(c.articles),
      new Set([
        new Article({
          author: 'Test',
          content: '<p>Test</p>\n',
          date: new Date('2023-01-01'),
          published: true,
          title: 'Test',
        }),
        new Article({
          author: 'Test 2',
          content: '<p>Test 2</p>\n',
          date: new Date('2023-01-02'),
          published: true,
          title: 'Test 2',
        }),
      ]),
    );
  });

  await test('single file', () => {
    const c = new Config(['test/inputs/test.toml']);
    deepEqual(c.articles, [
      new Article({
        author: 'Test',
        content: '<p>Test</p>\n',
        date: new Date('2023-01-01'),
        published: true,
        title: 'Test',
      }),
    ]);
  });

  await test('multiple files', () => {
    const c = new Config(['test/inputs/test.toml', 'test/inputs/test2.toml']);
    deepEqual(c.articles, [
      new Article({
        author: 'Test',
        content: '<p>Test</p>\n',
        date: new Date('2023-01-01'),
        published: true,
        title: 'Test',
      }),
      new Article({
        author: 'Test 2',
        content: '<p>Test 2</p>\n',
        date: new Date('2023-01-02'),
        published: true,
        title: 'Test 2',
      }),
    ]);
  });

  await test('overlapping file and dir', () => {
    const c = new Config(['test/inputs/test.toml', 'test/inputs/']);
    deepEqual(c.articles, [
      new Article({
        author: 'Test',
        content: '<p>Test</p>\n',
        date: new Date('2023-01-01'),
        published: true,
        title: 'Test',
      }),
      new Article({
        author: 'Test 2',
        content: '<p>Test 2</p>\n',
        date: new Date('2023-01-02'),
        published: true,
        title: 'Test 2',
      }),
    ]);
  });
});
