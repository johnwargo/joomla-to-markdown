/* 
  Export Command
  ==============
  Using a template, exports all of the Joomla article content into 
  separate markdown files in the output folder. 
*/

// export the articles
import { Command, Flags } from '@oclif/core'
import fs = require('fs');
import path = require('path');
import Turndown = require('turndown');
var parseJSON = require('date-fns/parseJSON')

// internal modules
import { getArticles, getCategories } from '../utils'
import { Article, Category } from '../types';
import Strings from '../strings'

// Create some objects we need to do our work
var strings = new Strings();
var turndownService = new Turndown();
var replacements: RegExpMatchArray[] = [];

export default class Go extends Command {
  static summary = 'Export'
  static description = 'Export all articles as markdown files.'
  static aliases = ['e']
  static examples = [strings.fourParamExample]

  static flags = { debug: Flags.boolean({ char: 'd' }) }

  static args = [
    {
      name: strings.sourceFolderParam,
      description: strings.sourceFolderDescription,
      required: true
    }, {
      name: strings.prefixParam,
      description: strings.prefixDescription,
      required: true
    }, {
      name: strings.outputFolderParam,
      description: strings.outputFolderDescription,
      required: true
    },
    {
      name: strings.templateParam,
      description: strings.templateDescription,
      required: false
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Go)

    var template: string;

    return new Promise((resolve, reject) => {

      this.log(`\nValidating Input Parameters\n===========================`);
      // does the export folder exist? (it should, I don't want to have to worry about creating it)      
      const outputFolder = path.join('./', args[strings.outputFolderParam]);
      if (fs.existsSync(outputFolder)) {
        this.log(`Folder '${outputFolder}' exists`);
      } else {
        this.error(`Output folder '${outputFolder}' does not exist, please create it and try again.`);
      }

      // Do we have a template argument?
      if (args[strings.templateParam]) {
        // does the export folder exist? (it should, I don't want to have to worry about creating it)
        const templateFile = path.join('./', args[strings.templateParam]);
        if (fs.existsSync(templateFile)) {
          this.log(`Template file '${templateFile}' exists`);
        } else {
          this.error(`Template file '${templateFile}'does not exist, please correct the file name and try again.`);
        }

        this.log('Checking template file for replacable tokens\n');
        // read the template file
        template = fs.readFileSync(templateFile, 'utf8');
        // get the template code matches
        // @ts-ignore
        replacements = template.match(/\{\{([^}]+)\}\}/g);
        if (!replacements) {
          this.error('Template file contains no replacement tokens, please correct the file and try again.');
        }
        console.dir(replacements);
      }

      // start by getting the categories
      console.log('\nCategories\n==========');
      var categories: Category[] = getCategories(args[strings.sourceFolderParam],
        args[strings.prefixParam], flags.debug);
      if (categories.length > 0) {
        this.log(`Categories: ${categories.length.toLocaleString("en-US")}\n`);
      } else {
        this.error('No categories found.');
      }

      // next get the articles
      console.log('Articles\n========');
      var articles: Article[] = getArticles(args[strings.sourceFolderParam],
        args[strings.prefixParam], flags.debug);
      if (articles.length > 0) {
        this.log(`Articles: ${articles.length.toLocaleString("en-US")}\n`)
        for (var article of articles) {
          // Find the category title for this article
          var category: Category = <Category>categories.find(c => c.id === article.catid);
          // Set the category title and alias in the article object
          // category alias is (currently) used in the file name
          // strip colons from the title
          article.category_title = category ? category.title.replace(/:/g,'') : 'Unknown';
          article.category_alias = category ? category.alias : 'unknown';
          if (args[strings.templateParam]) {
            ExportArticle(article, template, replacements, outputFolder);
          } else {
            writeArticle(article, outputFolder);
          }
        }
      } else {
        this.error('No articles found.')
      }
      resolve();  // we made it this far, so resolve the promise
    });

  }
}
function zeroPad(tmpVal: string): string {
  return tmpVal.toString().padStart(2, '0');
}

function fixFileName(fileName: string): string {
  // remove forbidden characters from the file name
  return fileName.trim().toLowerCase().replace(/[\\/:"*?<>|]+/g, '');
}

function buildJekyllFileName(title: string, articleDate: string): string {
  // replace spaces with dashes
  var tempTitle = fixFileName(title).replace(/\s+/g, '-');
  // convert the date string into a Date/Time object
  var tempDate = parseJSON(articleDate);
  // build the file name
  return `${tempDate.getFullYear()}-${zeroPad(tempDate.getMonth() + 1)}-${zeroPad(tempDate.getDate())}-${tempTitle}.md`;
}

async function ExportArticle(
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
  var outputFileName = path.join(outputFolder, buildJekyllFileName(article.title, article.created));
  outputFileName = outputFileName
  console.log(`Writing file '${outputFileName}'\n`);
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}

async function writeArticle(
  article: Article,
  outputFolder: string,
  debug: boolean = false) {
  const crlf = '\r\n';
  function buildFileString(heading: string, text: string): string {
    return `**${heading.trim()}:** ${text}${crlf}`;
  }

  console.log(`writeArticle('${article.title}', '${outputFolder}')`);
  var outputFileName = path.join(outputFolder, fixFileName(`${article.category_alias}-${article.alias}.md`));
  outputFileName = outputFileName.replace(/[\:"*?<>|]+/g, '');
  console.log(`Output File: '${outputFileName}'\n`);
  var docBody = '';
  docBody += buildFileString('Title', article.title);
  docBody += buildFileString('ID', article.id.toString());
  docBody += buildFileString('Alias', article.alias);
  docBody += buildFileString('Category', article.category_title!);
  docBody += buildFileString('Category ID', article.catid);
  docBody += buildFileString('Created', article.created);
  docBody += crlf;
  // convert the article body to markdown
  var markdownBody = turndownService.turndown(article.introtext);
  docBody += markdownBody;
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}
