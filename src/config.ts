import { Article, type ArticleConfig } from './article';
import { readFileSync, lstatSync } from 'fs';
import toml from '@iarna/toml';
import * as path from 'path';
import { globSync } from 'glob';

export class Config {
  readonly articles: Article[];

  constructor(configPaths: string[]) {
    const config = configPaths.flatMap((configPath) => this.readConfig(configPath)).join('\n');
    this.articles = (toml.parse(config).articles as unknown as ArticleConfig[]).map(article => new Article(article));
  }

  private readConfig(configPath: string): string[] {
    const configPathStat = lstatSync(configPath);
    const configFiles = configPathStat.isDirectory() ? globSync(path.join(configPath, '**', '*.toml')) : [configPath];
    return configFiles.map(file => readFileSync(file).toString());
  }
}
