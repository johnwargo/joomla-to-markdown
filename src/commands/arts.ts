// List all of the articles in the export file

import { Command, Flags } from '@oclif/core'
import { Article, getArticles } from '../utils'
import Strings from '../strings'
var strings = new Strings()

export default class Arts extends Command {
  static summary = 'Article List'
  static description = 'List all the articles in the export file.'
  static examples = [strings.twoParamExample]

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
    const { args, flags } = await this.parse(Arts)

    // const debug: boolean = flags.debug
    // if (debug) {
    //   console.log('Debug mode enabled')
    // }

    var articles: Article[] = getArticles(args.folder, args.prefix)
    if (articles.length > 0) {
      console.log(`Articles: ${articles.length}`)
      for (var article of articles) {
        console.log(`${article.name}  (${article.idx}, ${article.alias})`)
      }
    } else {
      console.log('No articles found.')
    }
  }
}
