import { renderIndex } from '../src/index';
import { Article } from '../src/article';

describe('render index', () => {
  test('simple', () => {
    const articles: Article[] = [];
    const template = '<html></html>';
    const result = renderIndex(template, articles);
    expect(result).toBe('<html></html>');
  });

  test('with articles', () => {
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
    expect(result).toBe(
      '<html><body>On Walruses<br />On Turtles<br /></body></html>',
    );
  });

  test('skip unpublished', () => {
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
    expect(result).toBe('<html><body>On Walruses<br /></body></html>');
  });
});
