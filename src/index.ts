#!/usr/bin/env node
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'ts-command-line-args';
import { Config } from './config';
import { type Article } from './article';

export function renderIndex(template: string, articles: Article[]): string {
  articles = articles.filter((a) => a.published);
  articles.sort((a: Article, b: Article) => a.compareDate(b));
  articles.reverse();
  return Handlebars.compile(template)({ articles });
}

interface CLIArgs {
  articlesDir?: string,
  indexTemplate?: string,
  outFile?: string,
  help?: boolean,
}

if (require.main === module) {
  const args = parse<CLIArgs>({
    articlesDir: { type: String, optional: true, description: 'Path to directory containing articles. Default: articles' },
    indexTemplate: { type: String, optional: true, description: 'Path to index template file. Default: templates/index.hb.html' },
    outFile: { type: String, optional: true, description: 'Path to file to write output. Default: STDOUT' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide.' }
  }, {
    helpArg: 'help'
  });
  const config = new Config(args.articlesDir ?? 'articles');
  const template = readFileSync(args.indexTemplate ?? 'templates/index.hb.html').toString();
  const index = renderIndex(template, config.articles);
  if (args.outFile !== undefined) {
    writeFileSync(args.outFile, index);
  } else {
    console.log(index);
  }
}
