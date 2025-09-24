#!/usr/bin/env node
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'ts-command-line-args';
import { Config } from './config.js';
import { type Article } from './article.js';
import esMain from 'es-main';

export function renderIndex(template: string, articles: Article[]): string {
  articles = articles.filter((a) => a.published);
  articles.sort((a: Article, b: Article) => a.compareDate(b));
  articles.reverse();
  return Handlebars.compile(template)({ articles });
}

export function renderArticle(template: string, article: Article): string {
  return Handlebars.compile(template)({ article });
}

export function renderArticles(template: string, articles: Article[]): Record<string, string> {
  articles = articles.filter((a) => a.published);
  return Object.fromEntries(articles.map((article) => [article.slug, renderArticle(template, article)]));
}

interface AppArgs {
  config?: string,
  indexTemplate?: string,
  articleTemplate?: string,
  outFile?: string,
  outDir?: string,
  help?: boolean,
}

function main(args: AppArgs): void {
  const config = new Config([args.config ?? 'articles'].flat());
  const indexTemplate = readFileSync(args.indexTemplate ?? 'templates/index.hb.html').toString();
  const articleTemplatePath = args.articleTemplate ?? 'templates/article.hb.html';
  const articleTemplate = existsSync(articleTemplatePath) ? readFileSync(articleTemplatePath).toString() : undefined;
  const index = renderIndex(indexTemplate, config.articles);
  if (args.outFile !== undefined) {
    writeFileSync(args.outFile, index);
  } else {
    console.log(index);
  }
  if (args.outDir !== undefined && articleTemplate !== undefined) {
    Object.entries(renderArticles(articleTemplate, config.articles)).map(([slug, article]) => {
      writeFileSync(`${args.outDir}/${slug}.html`, article);
    });
  }
}

if (esMain(import.meta)) {
  const args = parse<AppArgs>({
    config: { type: String, optional: true, multiple: true, description: 'Path to config file or directory of config files. Default: articles' },
    indexTemplate: { type: String, optional: true, description: 'Path to index template file. Default: templates/index.hb.html' },
    articleTemplate: { type: String, optional: true, description: 'Path to article template file. Default: templates/article.hb.html' },
    outFile: { type: String, optional: true, description: 'Path to file to write output. Default: STDOUT' },
    outDir: { type: String, optional: true, description: 'Directory to write articles to. If not provided, no articles are written.' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide.' }
  }, {
    helpArg: 'help'
  });
  main(args);
}
