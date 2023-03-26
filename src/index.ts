#!/usr/bin/env node
import { Article, type ArticleConfig } from './article';
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import toml from '@iarna/toml';
import * as path from 'path';

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

if (require.main === module) {
  const args = process.argv;
  const articles = getArticles(args[2]);
  const template = readFileSync(args[3]).toString();
  const index = renderIndex(template, articles);
  writeFileSync(args[4], index);
}
