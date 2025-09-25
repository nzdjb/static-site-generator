import { Article } from '../src/article.js';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { describe, test } from 'node:test';
import { ok, equal, deepEqual } from 'node:assert';

await describe('article', async () => {
  await test('creates', () => {
    const title = 'test article';
    const author = 'Bob';
    const date = new Date('January 1, 2023 12:34:56');
    const content = '# test';
    const published = true;
    const article = new Article({
      title,
      author,
      date,
      content,
      published,
    });
    ok(article instanceof Article);
    equal(article.title, title);
    equal(article.author, author);
    equal(article.date, '2023-01-01');
    equal(article.content, '<h1>test</h1>\n');
    equal(article.published, true);
  });

  await test('creates with contentFile', () => {
    const title = 'test article';
    const author = 'Bob';
    const date = new Date('January 1, 2023 12:34:56');
    const contentFile = 'test/inputs/test.md';
    const published = true;
    const article = new Article({
      title,
      author,
      date,
      contentFile,
      published,
    });
    ok(article instanceof Article);
    equal(article.title, title);
    equal(article.author, author);
    equal(article.date, '2023-01-01');
    equal(article.content, '<h1>test</h1>\n');
    equal(article.published, true);
  });

  await test('creates with defaults', () => {
    const title = 'test article';
    const date = new Date('January 1, 2023');
    const content = '';
    const article = new Article({
      title,
      date,
      content,
    });
    ok(article instanceof Article);
    equal(article.title, title);
    equal(article.author, undefined);
    equal(article.date, '2023-01-01');
    equal(article.content, '');
    equal(article.published, true);
  });

  await test('compare dates', () => {
    const a = new Article({
      title: '',
      content: '',
      date: new Date('January 1, 2023 12:34:56'),
    });
    const b = new Article({
      title: '',
      content: '',
      date: new Date('January 1, 2023 13:34:56'),
    });
    const c = new Article({
      title: '',
      content: '',
      date: new Date('January 2, 2023 12:34:56'),
    });
    const d = new Article({
      title: '',
      content: '',
      date: new Date('January 3, 2023 12:34:56'),
    });
    equal(a.compareDate(a), 0);
    equal(a.compareDate(b), 0);
    equal(a.compareDate(c), -1);
    equal(d.compareDate(c), 1);
    deepEqual(
      [a, c, d].sort((a: Article, b: Article) => a.compareDate(b)),
      [a, c, d]);
    deepEqual(
      [d, a, c].sort((a: Article, b: Article) => a.compareDate(b)),
      [a, c, d]);
  });

  const slugTests = {
    'a': 'a',
    'A': 'a',
    'A Turtle': 'a-turtle',
    ' A Turtle ': 'a-turtle',
    'Hello! Welcome to the Turtle-Show!': 'hello-welcome-to-the-turtle-show',
    '!@#$%^&*()_+-=': '-'
  };

  await Promise.all(Object.entries(slugTests).map(async ([title, expected]) => {
    await test(`slug: ${title}`, async () => {
      const article = new Article({
        title,
        content: '',
        date: new Date('January 1, 2023 12:34:56'),
      });
      equal(article.slug, expected);
    });
  }));
});
