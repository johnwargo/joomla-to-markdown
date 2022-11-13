import {Command, Flags} from '@oclif/core'
import chalk from 'chalk';  //https://github.com/chalk/chalk
import { Article, Category, getArticles, getCategories } from '../utils'

export default class Stats extends Command {
  static summary = 'Statistics'
  static description = 'List statistics for the export files.'
  static examples = [
    '<%= config.bin %> <%= command.id %> inputFolder j3TablePrefix',  
  ]

  static flags = {
     // debug: Flags.boolean({ char: 'd' }),    
  }

  static args = [
    {
      name: 'folder', required: true,
      description: 'The name of the folder where the Joomla table export files are stored (use . for current folder).'
    },
    { name: 'prefix', required: true, description: 'Joomla table export file prefix.' }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Stats)

    var categories: Category[] = getCategories(args.folder, args.prefix)
    if (categories.length > 0) {
      console.log(`Categories: ${categories.length}`)      
    } else {
      console.log('No categories found.')
    }

    var articles: Article[] = getArticles(args.folder, args.prefix)
    if (articles.length > 0) {
      console.log(`Articles: ${articles.length}`)      
    } else {
      console.log('No articles found.')
    }
    
  }
}
