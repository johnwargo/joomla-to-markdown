// List all of the articles in the export file

import { CliUx, Command, Flags } from '@oclif/core'
// internal modules
import { Article, getArticles } from '../utils'
import Strings from '../strings'
var strings = new Strings()

export default class Arts extends Command {
  static summary = 'Article List'
  static description = 'List all the articles in the export file.'
  static aliases = ['a']
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
    const { args, flags } = await this.parse(Arts)

    // const debug: boolean = flags.debug
    // if (debug) {
    //   console.log('Debug mode enabled')
    // }

    // @ts-ignore
    const columns: CliUx.Table.Columns = {
      idx: { header: 'Idx' },
      name: { header: 'Title' },
      alias: { header: 'Alias' }
    }

    var articles: Article[] = getArticles(args[strings.sourceFolderParam], args[strings.prefixParam])
    if (articles.length > 0) {
      this.log(`\n${articles.length} articles`)
      // for (var article of articles) {
      //   this.log(`${article.name}  (${article.idx}, ${article.alias})`)
      // }
      this.log()
      CliUx.ux.table(articles, columns, {})
    } else {
      this.error('No articles found.')
    }
  }
}
