import { Command, Flags } from '@oclif/core'
// internal modules
import { Article, Category, getArticles, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()

export default class Stats extends Command {
  static summary = 'Statistics'
  static description = 'List statistics for the export files.'
  static examples = [strings.twoParamExample]

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
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Stats)
    this.log(`Source Folder Parameter: ${strings.sourceFolderParam}`)
    this.log()
    var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam], true)
    if (categories.length > 0) {
      this.log(`Entries: ${categories.length.toLocaleString("en-US")}`)
    } else {
      this.error('No categories found.')
    }
    console.log()
    var articles: Article[] = getArticles(args[strings.sourceFolderParam], args[strings.prefixParam], true)
    if (articles.length > 0) {
      this.log(`Entries: ${articles.length.toLocaleString("en-US")}`)
    } else {
      this.error('No articles found.')
    }
  }
}
