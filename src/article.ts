import { marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { readFileSync } from 'node:fs';
import sanitizeHTML from 'sanitize-html';

const sanitizerSettings: sanitizeHTML.IOptions = {
  allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img', 'h1']),
  allowedAttributes: {
    ...sanitizeHTML.defaults.allowedAttributes,
    '*': ['id', 'aria-label'],
  },
  disallowedTagsMode: 'escape',
};

export interface Link {
  target: string;
  title: string;
}

interface ArticleBaseConfig {
  title: string;
  author?: string;
  date: Date;
  published?: boolean;
}

interface ArticleStringConfig extends ArticleBaseConfig {
  content: string;
}

interface ArticleFileConfig extends ArticleBaseConfig {
  contentFile: string;
}

export type ArticleConfig = ArticleStringConfig | ArticleFileConfig;

export class Article {
  readonly title: string;
  readonly content: string;
  readonly author?: string;
  readonly date: string;
  readonly published: boolean;
  readonly slug: string;

  constructor(input: ArticleConfig) {
    this.title = input.title;
    this.author = input.author;
    this.date = input.date.toISOString().split('T')[0];
    this.slug = input.title.trim().toLocaleLowerCase().replaceAll(/[^a-zA-Z0-9-\s]/g, '').replaceAll(/\s/g, '-');
    const content = "content" in input ? input.content : readFileSync(input.contentFile).toString();
    this.content = sanitizeHTML(
      marked.use(markedFootnote({
        description: '', // Unfortunately, this still leaves the h2 in.
        prefixId: `footnote-${this.slug}-`,
      })).parse(content, { async: false }) as string,
      sanitizerSettings
    );
    this.published = input.published ?? true;
  }

  compareDate(other: Article): number {
    return this.date === other.date ? 0 : this.date > other.date ? 1 : -1;
  }
}
