import { renderIndex } from '../src/index.js';
import { Article } from '../src/article.js';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { describe, test } from 'node:test';
import { equal } from 'node:assert';

await describe('render index', async () => {
  await test('simple', () => {
    const articles: Article[] = [];
    const template = '<html></html>';
    const result = renderIndex(template, articles);
    equal(result, '<html></html>');
  });

  await test('with articles', () => {
    const template =
      '<html><body>{{#each articles}}{{this.title}}<br />{{/each}}</body></html>';
    const articles = [
      new Article({
        date: new Date('January 1, 2023, 12:12:12'),
        title: 'On Turtles',
        content: 'Sometimes turtles visit the beach.',
      }),
      new Article({
        date: new Date('January 2, 2023'),
        title: 'On Walruses',
        content: 'The walrus is not to be trifled with.',
      }),
    ];
    const result = renderIndex(template, articles);
    equal(result,
      '<html><body>On Walruses<br />On Turtles<br /></body></html>',
    );
  });

  await test('skip unpublished', () => {
    const template =
      '<html><body>{{#each articles}}{{this.title}}<br />{{/each}}</body></html>';
    const articles = [
      new Article({
        date: new Date('January 1, 2023, 12:12:12'),
        title: 'On Turtles',
        content: 'Sometimes turtles visit the beach.',
        published: false,
      }),
      new Article({
        date: new Date('January 2, 2023'),
        title: 'On Walruses',
        content: 'The walrus is not to be trifled with.',
      }),
    ];
    const result = renderIndex(template, articles);
    equal(result, '<html><body>On Walruses<br /></body></html>');
  });
});
