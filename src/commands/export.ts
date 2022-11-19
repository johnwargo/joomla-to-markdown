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

const crlf = '\r\n';

// Create some objects we need to do our work
var strings = new Strings()
var turndownService = new Turndown()

export default class Go extends Command {
  static summary = 'Export'
  static description = 'Export all articles as markdown files.'
  static aliases = ['e']
  static examples = [strings.threeParamExample]

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
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Go)


    return new Promise((resolve, reject) => {
      // does the export folder exist? (it should, I don't want to have to worry about creating it)
      this.log('\nOutput Folder\n=============');
      const outputFolder = path.join('./', args[strings.outputFolderParam]);
      this.log(`Folder: '${outputFolder}'`);
      if (fs.existsSync(outputFolder)) {
        this.log('Folder exists\n');
      } else {
        this.error('Output folder does not exist, please create it and try again.');
      }

      // start by getting the categories
      console.log('Categories\n==========');
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
          article.categoryTitle = category ? category.title : 'Unknown';
          article.categoryAlias = category ? category.alias : 'unknown';
          ExportArticle(article, outputFolder);
          // writeArticle(article, outputFolder);
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

function buildJekyllFileName(title: string, articleDate: string): string {
  // replace spaces with dashes
  var tempTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
  // convert the date string into a Date/Time object
  var tempDate = parseJSON(articleDate);
  // build the file name
  return `${tempDate.getFullYear()}-${zeroPad(tempDate.getMonth() + 1)}-${zeroPad(tempDate.getDate())}-${tempTitle}.md`;
}

async function ExportArticle(article: Article, outputFolder: string) {
  console.log(`ExportArticle('${article.title}', '${outputFolder}')`);
  // Calculate the file name
  var outputFileName = path.join(outputFolder, buildJekyllFileName(article.title, article.created));
  console.log(outputFileName);

}

async function writeArticle(article: Article, outputFolder: string) {
  function buildFileString(heading: string, text: string): string {
    return `**${heading.trim()}:** ${text}${crlf}`;
  }

  console.log(`ExportArticle('${article.title}', '${outputFolder}')`);
  var outputFileName = path.join(outputFolder, `${article.categoryAlias}-${article.alias}.md`);
  console.log(`\nOutput File: '${outputFileName}'\n`);
  var docBody = '';
  docBody += buildFileString('Title', article.title);
  docBody += buildFileString('ID', article.id.toString());
  docBody += buildFileString('Alias', article.alias);
  docBody += buildFileString('Category', article.categoryTitle!);
  docBody += buildFileString('Category ID', article.catid);
  docBody += buildFileString('Created', article.created);
  docBody += crlf;
  // convert the article body to markdown
  var markdownBody = turndownService.turndown(article.introtext);
  docBody += markdownBody;
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}
