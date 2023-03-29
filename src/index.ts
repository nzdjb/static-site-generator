#!/usr/bin/env node
import { Article, type ArticleConfig } from './article';
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import toml from '@iarna/toml';
import * as path from 'path';
import { parse } from 'ts-command-line-args';

export function getArticles(articlesDir: string): Article[] {
  const config = readdirSync(articlesDir).map(file => path.join(articlesDir, file)).map(file => readFileSync(file).toString()).join('\n');
  return (toml.parse(config).articles as unknown as ArticleConfig[]).map(article => new Article(article));
}

export function renderIndex(template: string, articles: Article[]): string {
  articles = articles.filter((a) => a.published);
  articles.sort((a: Article, b: Article) => a.compareDate(b));
  articles.reverse();
  return Handlebars.compile(template)({ articles });
}

interface CLIArgs {
  articlesDir: string,
  indexTemplate: string,
  outFile?: string,
  help?: boolean,
}

if (require.main === module) {
  const args = parse<CLIArgs>({
    articlesDir: String,
    indexTemplate: String,
    outFile: { type: String, optional: true },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide.' }
  }, {
    helpArg: 'help'
  });
  const articles = getArticles(args.articlesDir);
  const template = readFileSync(args.indexTemplate).toString();
  const index = renderIndex(template, articles);
  if (args.outFile !== undefined) {
    writeFileSync(args.outFile, index);
  } else {
    console.log(index);
  }
}
