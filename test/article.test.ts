import { Article } from '../src/article';

describe('article', () => {
  test('creates', () => {
    const title = 'Test article';
    const author = 'Bob';
    const date = new Date('January 1, 2023 12:34:56');
    const content = '# Test';
    const published = true;
    const article = new Article({
      title,
      author,
      date,
      content,
      published,
    });
    expect(article).toBeInstanceOf(Article);
    expect(article.title).toBe(title);
    expect(article.author).toBe(author);
    expect(article.date).toBe('2023-01-01');
    expect(article.content).toBe('<h1>Test</h1>\n');
    expect(article.published).toBe(true);
  });

  test('creates with defaults', () => {
    const title = 'Test article';
    const date = new Date('January 1, 2023');
    const content = '';
    const article = new Article({
      title,
      date,
      content,
    });
    expect(article).toBeInstanceOf(Article);
    expect(article.title).toBe(title);
    expect(article.author).toBeUndefined();
    expect(article.date).toBe('2023-01-01');
    expect(article.content).toBe('');
    expect(article.published).toBe(true);
  });

  test('compare dates', () => {
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
    expect(a.compareDate(a)).toBe(0);
    expect(a.compareDate(b)).toBe(0);
    expect(a.compareDate(c)).toBe(-1);
    expect(d.compareDate(c)).toBe(1);
    expect(
      [a, c, d].sort((a: Article, b: Article) => a.compareDate(b)),
    ).toStrictEqual([a, c, d]);
    expect(
      [d, a, c].sort((a: Article, b: Article) => a.compareDate(b)),
    ).toStrictEqual([a, c, d]);
  });
});
