#!/usr/bin/env node
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
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

const siteMapSchemaUrl = 'https://www.sitemaps.org/schemas/sitemap/0.9';
export function renderSiteMap(baseUrl: string, articles: Article[]): string {
  const urlTags = articles.map((article) => {
    return `<url><loc>${baseUrl}article/${article.slug}</loc></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="${siteMapSchemaUrl} ${siteMapSchemaUrl}/sitemap.xsd"
  xmlns="${siteMapSchemaUrl}">
  ${urlTags.join("\n")}
</urlset>`
}

export function loadPartials(partialsDir: string): void {
  readdirSync(partialsDir, { withFileTypes: true }).forEach((partial) => {
    if (partial.isFile() || partial.isSymbolicLink()) {
      Handlebars.registerPartial(partial.name, readFileSync(`${partialsDir}/${partial.name}`).toString());
    }
  });
}

interface AppArgs {
  config?: string,
  indexTemplate?: string,
  articleTemplate?: string,
  outFile?: string,
  outDir?: string,
  partialsDir?: string,
  createSiteMap?: boolean,
  baseUrl?: string,
  help?: boolean,
}

function main(args: AppArgs): void {
  const config = new Config([args.config ?? 'articles'].flat());
  const indexTemplate = readFileSync(args.indexTemplate ?? 'templates/index.hb.html').toString();
  const articleTemplatePath = args.articleTemplate ?? 'templates/article.hb.html';
  const articleTemplate = existsSync(articleTemplatePath) ? readFileSync(articleTemplatePath).toString() : undefined;
  const partialsDir = args.partialsDir ?? 'partials';
  if (existsSync(partialsDir)) loadPartials(partialsDir);
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
  const baseUrl = (args.baseUrl ?? '/').replace(/\/?$/, '/');
  const createSiteMap = args.createSiteMap ?? false;
  if (createSiteMap && args.outDir !== undefined) {
    const siteMap = renderSiteMap(baseUrl, config.articles);
    writeFileSync(`${args.outDir}/sitemap.xml`, siteMap);
  }
}

if (esMain(import.meta)) {
  const args = parse<AppArgs>({
    config: { type: String, optional: true, multiple: true, description: 'Path to config file or directory of config files. Default: articles' },
    indexTemplate: { type: String, optional: true, description: 'Path to index template file. Default: templates/index.hb.html' },
    articleTemplate: { type: String, optional: true, description: 'Path to article template file. Default: templates/article.hb.html' },
    outFile: { type: String, optional: true, description: 'Path to file to write output. Default: STDOUT' },
    outDir: { type: String, optional: true, description: 'Directory to write articles to. If not provided, no articles are written.' },
    partialsDir: { type: String, optional: true, description: 'Directory to laod partials from. Default: partials' },
    createSiteMap: { type: Boolean, optional: true, alias: 's', description: 'Creates a sitemap. Default: false' },
    baseUrl: { type: String, optional: true, alias: 'b', description: 'Base URL to use when using absolute links. Default: "/"' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide.' }
  }, {
    helpArg: 'help'
  });
  main(args);
}
