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
  config?: string,
  indexTemplate?: string,
  outFile?: string,
  help?: boolean,
}

if (require.main === module) {
  const args = parse<CLIArgs>({
    config: { type: String, optional: true, description: 'Path to config file or directory of config files. Default: articles' },
    indexTemplate: { type: String, optional: true, description: 'Path to index template file. Default: templates/index.hb.html' },
    outFile: { type: String, optional: true, description: 'Path to file to write output. Default: STDOUT' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide.' }
  }, {
    helpArg: 'help'
  });
  const config = new Config(args.config ?? 'articles');
  const template = readFileSync(args.indexTemplate ?? 'templates/index.hb.html').toString();
  const index = renderIndex(template, config.articles);
  if (args.outFile !== undefined) {
    writeFileSync(args.outFile, index);
  } else {
    console.log(index);
  }
}
