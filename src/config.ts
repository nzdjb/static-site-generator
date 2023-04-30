import { Article, type ArticleConfig } from './article';
import { readFileSync, readdirSync } from 'fs';
import toml from '@iarna/toml';
import * as path from 'path';

export class Config {
  readonly articles: Article[];

  constructor(configPath: string) {
    const config = readdirSync(configPath).map(file => path.join(configPath, file)).map(file => readFileSync(file).toString()).join('\n');
    this.articles = (toml.parse(config).articles as unknown as ArticleConfig[]).map(article => new Article(article));
  }
}
