// export the articles
import { Command, Flags } from '@oclif/core'
import fs = require('fs')
import path = require('path')
// internal modules
import { Article, Category, getArticles, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()

export default class Go extends Command {
  static summary = 'Export'
  static description = 'Export all of the articles as markdown files.'
  static examples = [strings.threeParamExample]

  static flags = {
    // debug: Flags.boolean({ char: 'd' })
  }

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
      console.log('\nOutput Folder\n=============');
      const outputFolder = path.join('./', args[strings.outputFolderParam]);
      console.log(`Folder: ${outputFolder}`);
      if (fs.existsSync(outputFolder)) {
        console.log('Folder exists\n');
      } else {
        console.log('Output folder does not exist, please create it and try again.');
        reject('Output folder does not exist');
        return;
      }

      // start by getting the categories
      console.log('Categories\n==========');
      var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam]);
      if (categories.length > 0) {
        console.log(`Categories: ${categories.length.toLocaleString("en-US")}\n`);
      } else {
        console.log('No categories found.');
        reject('No categories found.');
        return;
      }

      // next get the articles
      console.log('Articles\n========');
      var articles: Article[] = getArticles(args[strings.sourceFolderParam], args[strings.prefixParam])
      if (articles.length > 0) {
        console.log(`Articles: ${articles.length.toLocaleString("en-US")}\n`)

      } else {
        console.log('No articles found.')
        reject('No articles found.');
        return;
      }

      resolve();
    });

  }
}
