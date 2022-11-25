import fs = require('fs');
import path = require('path');
var parseJSON = require('date-fns/parseJSON');
import Turndown = require('turndown');

import { Article, Category } from './types';

const catFileRoot: string = "_categories.json"
const artFileRoot: string = "_content.json"

var turndownService = new Turndown();

export function getCategories(inputFolder: string, prefix: string, debug: boolean = false): Category[] {

  var categories: Category[] = []

  if (debug) console.log(`getCategories('${inputFolder}', '${prefix}')`)

  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + catFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    if (debug) console.log(`Input file: "${inputFile}"`)
    // does the input file exist?
    if (fs.existsSync(inputFile)) {
      // read the data from the file
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
      for (var obj of data) {
        if (obj.type == 'table') {
          console.log(`Database: ${obj.database}`);
          console.log(`Table: ${obj.name}`);
          categories = obj.data;
          // const catsData = obj.data
          // for (var category of catsData) categories.push(category);
        }
      }
    } else {
      console.log(`File: "${inputFile}" does not exist.`)
    }
  } else {
    console.log(`Input folder: "${inputFolder}" does not exist.`)
  }
  return categories.sort(compareFunction)
}

export function getArticles(inputFolder: string, prefix: string, debug: boolean = false): Article[] {

  var articles: Article[] = []

  if (debug) console.log(`getArticles('${inputFolder}', '${prefix}')`)

  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + artFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    if (debug) console.log(`Input file: "${inputFile}"`)
    // does the input file exist?
    if (fs.existsSync(inputFile)) {
      // read the data from the file
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
      for (var obj of data) {
        if (obj.type == 'table') {
          console.log(`Database: ${obj.database}`)
          console.log(`Table: ${obj.name}`)
          articles = obj.data;
          // const artsData = obj.data
          // for (var article of artsData) {
          //   articles.push({
          //     idx: parseInt(article.id),
          //     catIdx: parseInt(article.catid),
          //     name: article.title,
          //     alias: article.alias,
          //     created: article.created,
          //     body: article.introtext,
          //   })
          // }
        }
      }
    } else {
      console.log(`File: "${inputFile}" does not exist.`)
    }
  } else {
    console.log(`Input folder: "${inputFolder}" does not exist.`)
  }
  // no need to sort the articles?
  return articles
}

export function exportArticle(
  article: Article,
  template: string,
  replacements: RegExpMatchArray[],
  outputFolder: string,
  debug: boolean = false) {

  var docBody: string;

  console.log(`\nExportArticle('${article.title}', template, '${outputFolder}', replacements)`);
  if (debug) console.dir(article);
  // convert the article body to markdown
  article.introtext = turndownService.turndown(article.introtext);
  // copy the template into the document body
  docBody = template;
  // process the replacements
  for (var replacement of replacements) {
    // just in case the template uses mixed case for this property
    var searchText: string = replacement.toString().toLowerCase();
    // strip the braces and any errant spaces
    var propertyName: string = searchText.replace('{{', '').replace('}}', '').trim();
    // get the value of the property
    // @ts-ignore
    var propertyValue: string = article[propertyName];

    if (debug) {
      console.log(`Category Title: ${article.category_title}`);
      console.log(`\nSearch Text: ${searchText}, property name: ${propertyName}, replace with '${propertyValue}'`);
    }

    if (propertyValue) {
      // @ts-ignore
      docBody = docBody.replaceAll(searchText, propertyValue);
    }
  }

  if (debug) console.dir(docBody);

  // Calculate the output file name  
  var outputFileName = path.join(outputFolder, buildOutputFileName(article.title, article.created));
  console.log(`Writing file '${outputFileName}'\n`);
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}

export function writeGenericArticle(
  article: Article,
  outputFolder: string,
  debug: boolean = false) {

  const crlf = '\r\n';
  const threeDashes = '---' + crlf;

  function buildFileString(heading: string, text: string, debug: boolean = false): string {
    var tmpStr = `${heading.trim()}: ${text}${crlf}`
    if (debug) console.log(tmpStr);
    return tmpStr;
  }

  console.log(`writeArticle('${article.title}', '${outputFolder}')`);
  var outputFileName = path.join(outputFolder, buildOutputFileName(article.title, article.created));
  console.log(`Output File: '${outputFileName}'\n`);
  var docBody = threeDashes;
  docBody += buildFileString('Title', article.title);
  docBody += buildFileString('ID', article.id.toString());
  docBody += buildFileString('Alias', article.alias);
  docBody += buildFileString('Category', article.category_title!);
  docBody += buildFileString('Category ID', article.catid);
  docBody += buildFileString('Created', article.created);
  docBody += threeDashes;
  // convert the article body to markdown
  var markdownBody = turndownService.turndown(article.introtext);
  docBody += markdownBody;
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}

function buildOutputFileName(title: string, articleDate: string): string {
  // replace spaces with dashes
  var tempTitle = title.trim().toLowerCase().replace(/[\\/:"*?<>|]+/g, '');
  // convert the date string into a Date/Time object
  var tempDate = parseJSON(articleDate);
  // build the file name
  return `${tempDate.getFullYear()}-${zeroPad(tempDate.getMonth() + 1)}-${zeroPad(tempDate.getDate())}-${tempTitle}.md`;
}

function zeroPad(tmpVal: number, numChars: number = 2): string {
  return tmpVal.toString().padStart(numChars, '0');
}

function compareFunction(a: any, b: any) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}