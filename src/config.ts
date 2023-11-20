import { Article, type ArticleConfig } from './article';
import { readFileSync, lstatSync } from 'fs';
import toml from '@iarna/toml';
import * as path from 'path';
import { globSync } from 'glob';

export class Config {
  readonly articles: Article[];

  constructor(configPaths: string[]) {
    const configPathList = [...new Set(this.resolveConfigPaths(configPaths))];
    const config = configPathList.map((file => readFileSync(file).toString())).join('\n');
    this.articles = (toml.parse(config).articles as unknown as ArticleConfig[]).map(article => new Article(article));
  }

  private resolveConfigPaths(configPaths: string[]): string[] {
    return configPaths.flatMap((configPath) => {
      const configPathStat = lstatSync(configPath);
      return configPathStat.isDirectory() ? globSync(path.join(configPath, '**', '*.toml')) : [configPath];
    });
  }
}
