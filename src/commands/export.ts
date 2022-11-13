// export the articles
import { Command, Flags } from '@oclif/core'
import { getSystemErrorMap } from 'util'
import { Article, Category, getArticles, getCategories } from '../utils'

export default class Go extends Command {
  static summary = 'Export'
  static description = 'Export all of the articles as markdown files.'
  static examples = [
    '<%= config.bin %> <%= command.id %> inputFolder j3TablePrefix outputFolder',
  ]

  static flags = {
    // debug: Flags.boolean({ char: 'd' }),    
  }

  static args = [
    {
      name: 'inputFolder',
      required: true,
      description: 'The name of the folder where the Joomla table export files are stored (use . for current folder).'
    },
    {
      name: 'prefix',
      required: true,
      description: 'Joomla table export file prefix.'
    },
    {
      name: 'outputFolder',
      required: true,
      description: 'The name of the folder to store the exported articles files (markdown format).'
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Go)

    var categories: Category[] = getCategories(args.folder, args.prefix)
    if (categories.length > 0) {
      console.log(`Categories: ${categories.length.toLocaleString("en-US")}`)
    } else {
      console.log('No categories found.')
    }

    var articles: Article[] = getArticles(args.folder, args.prefix)
    if (articles.length > 0) {
      console.log(`Articles: ${articles.length.toLocaleString("en-US")}`)

    } else {
      console.log('No articles found.')
    }

  }
}
