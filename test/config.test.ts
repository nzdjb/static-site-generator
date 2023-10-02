import { Article } from '../src/article';
import { Config } from '../src/config';

describe('loadConfig', () => {
  test('simple', () => {
    const c = new Config('test/inputs');
    expect(c.articles).toIncludeSameMembers([
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

  test('single file', () => {
    const c = new Config('test/inputs/test.toml');
    expect(c.articles).toEqual([
      new Article({
        author: 'Test',
        content: '<p>Test</p>\n',
        date: new Date('2023-01-01'),
        published: true,
        title: 'Test',
      }),
    ]);
  });
});
