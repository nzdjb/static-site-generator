import { marked } from 'marked';
import sanitizeHTML from 'sanitize-html';

const sanitizerSettings: sanitizeHTML.IOptions = {
  allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img', 'h1']),
  disallowedTagsMode: 'escape',
};

export interface Link {
  target: string;
  title: string;
}

export interface ArticleConfig {
  title: string;
  author?: string;
  date: Date;
  content: string;
  published?: boolean;
}

export class Article {
  readonly title: string;
  readonly content: string;
  readonly author?: string;
  readonly date: string;
  readonly published: boolean;

  constructor(input: ArticleConfig) {
    this.title = input.title;
    this.author = input.author;
    this.date = input.date.toISOString().split('T')[0];
    this.content = sanitizeHTML(
      marked.parse(input.content),
      sanitizerSettings
    );
    this.published = input.published ?? true;
  }

  compareDate(other: Article): number {
    return this.date === other.date ? 0 : this.date > other.date ? 1 : -1;
  }
}
