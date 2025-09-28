import Handlebars from 'handlebars';
import { renderIndex, renderArticle, renderArticles, loadPartials } from '../src/index.js';
import { Article } from '../src/article.js';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { describe, test } from 'node:test';
import { deepEqual, equal } from 'node:assert';

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

await describe('render article', async () => {
  await test('simple', () => {
    const article = new Article({
      date: new Date('January 1, 2023, 12:12:12'),
      title: 'On Turtles',
      content: 'Sometimes turtles visit the beach.',
    });
    const template = '<html></html>';
    const result = renderArticle(template, article);
    equal(result, '<html></html>');
  });
});

await describe('render articles', async () => {
  await test('simple', () => {
    const articles: Article[] = [];
    const template = '<html></html>';
    const result = renderArticles(template, articles);
    deepEqual(result, {});
  });

  await test('multiple', async () => {
    const template =
      '<html><body>{{article.title}}</body></html>';
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
    const result = renderArticles(template, articles);
    deepEqual(result, {
      'on-turtles': '<html><body>On Turtles</body></html>',
      'on-walruses': '<html><body>On Walruses</body></html>',
    });
  });

  await test('skip unpublished', () => {
    const template =
      '<html><body>{{article.title}}</body></html>';
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
    const result = renderArticles(template, articles);
    deepEqual(result, {
      'on-walruses': '<html><body>On Walruses</body></html>',
    });
  });
});

await describe("partial loader", async () => {
  await test('loads partials', () => {
    loadPartials('test/partials');
    const partialsCount = Object.keys(Handlebars.partials).length;
    equal(partialsCount, 2);
    equal(Handlebars.partials['partial.hb.html'], 'aaaaaaa\n');
  });
  await test('loads symlink partials', () => {
    loadPartials('test/partials');
    const partialsCount = Object.keys(Handlebars.partials).length;
    equal(partialsCount, 2);
    equal(Handlebars.partials['link-partial.hb.html'], 'aaaaaaa\n');
  });
})
