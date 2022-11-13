import { Command, Flags } from '@oclif/core'
import { Article, Category, getArticles, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()

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
      name: strings.sourceFolderParam,
      required: true,
      description: strings.sourceFolderDescription,
    }, {
      name: strings.prefixParam,
      required: true,
      description: strings.prefixDescription
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Stats)

    console.log()
    var categories: Category[] = getCategories(args.folder, args.prefix)
    if (categories.length > 0) {
      console.log(`Entries: ${categories.length.toLocaleString("en-US")}`)
    } else {
      console.log('No categories found.')
    }

    console.log()
    var articles: Article[] = getArticles(args.folder, args.prefix)
    if (articles.length > 0) {
      console.log(`Entries: ${articles.length.toLocaleString("en-US")}`)
    } else {
      console.log('No articles found.')
    }

  }
}
