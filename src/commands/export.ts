/* 
  Export Command
  ==============
  Using a template, exports all of the Joomla article content into 
  separate markdown files in the output folder. 
*/

// export the articles
import { Command, Flags } from '@oclif/core'
var format = require('date-fns/format')
import fs = require('fs');
import path = require('path');
const yesno = require('yesno');

// internal modules
import { exportArticle, getArticles, getCategories, writeGenericArticle } from '../utils'
import { Article, Category } from '../types';
import Strings from '../strings'
import { utils } from 'mocha';

// Create some objects we need to do our work
var strings = new Strings();
var replacements: RegExpMatchArray[] = [];

export default class Export extends Command {
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
    },
    {
      name: strings.gmtOffsetParameter,
      description: strings.gmtOffsetDescription,
      required: false
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Export)

    var template: string;
    var gmtOffset: number = 0;

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

        if (args[strings.gmtOffsetParameter]) {
          this.log('has offset');
          gmtOffset = parseInt(args[strings.gmtOffsetParameter]);
          if (flags.debug) this.log(`GMT Offset: ${gmtOffset}`);
        }
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
        yesno({
          question: '\nExport all articles to markdown? Enter yes or no:',
          defaultValue: false,
          yesValues: ['Yes'],
          noValues: ['No']
        }).then((confirmExport: boolean) => {
          if (confirmExport) {
            this.log('Exporting articles...');
            for (var article of articles) {
              // Strip invalid characters from the article title
              article.title = article.title.replace(/[\\/:"*?<>|]+/g, '');
              // Adjust the created date (if needed)
              if (gmtOffset != 0) {
                article.created = article.created + " " + calculateOffsetString(gmtOffset);
              }
              // Find the category title for this article
              var category: Category = <Category>categories.find(c => c.id === article.catid);
              // Set the category title and alias in the article object
              // category alias is (currently) used in the file name
              // strip colons from the title
              article.category_title = category ? category.title.replace(/:/g, '') : 'Unknown';
              article.category_alias = category ? category.alias : 'unknown';
              if (args[strings.templateParam]) {
                exportArticle(article, template, replacements, outputFolder);
              } else {
                writeGenericArticle(article, outputFolder);
              }
            }
          } else {
            this.log('Export cancelled');
          }
        });
      } else {
        this.error('No articles found.')
      }
      resolve();  // we made it this far, so resolve the promise
    });
  }
}

function calculateOffsetString(offset: number): string {
  const isNegative = offset < 0;
  const offsetValStr = (Math.abs(offset) * 100).toString().padStart(4, '0');
  return isNegative ? '-' + offsetValStr : offsetValStr;
}