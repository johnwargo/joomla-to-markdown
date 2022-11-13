// export the articles
import { Command, Flags } from '@oclif/core'
import { Article, Category, getArticles, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()

export default class Go extends Command {
  static summary = 'Export'
  static description = 'Export all of the articles as markdown files.'
  static examples = [strings.threeParamExample]

  static flags = {
    // debug: Flags.boolean({ char: 'd' }),    
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

    var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam])
    if (categories.length > 0) {
      console.log(`Categories: ${categories.length.toLocaleString("en-US")}`)
    } else {
      console.log('No categories found.')
    }

    var articles: Article[] = getArticles(args[strings.sourceFolderParam], args[strings.prefixParam])
    if (articles.length > 0) {
      console.log(`Articles: ${articles.length.toLocaleString("en-US")}`)

    } else {
      console.log('No articles found.')
    }

  }
}
