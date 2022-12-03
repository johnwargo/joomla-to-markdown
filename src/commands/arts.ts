// List all of the articles in the export file

import { CliUx, Command, Flags } from '@oclif/core'
// internal modules
import Strings from '../strings';
import { Article } from '../types';
import { getArticles } from '../utils';

var strings = new Strings()

export default class Arts extends Command {
  static summary = 'Article List'
  static description = 'List all the articles in the export file.'
  static aliases = ['a']
  static examples = [strings.twoParamExample]
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
      id: { header: 'Id' },
      title: { header: 'Title' },
      alias: { header: 'Alias' }
    }

    var articles: Article[] = getArticles(args[strings.sourceFolderParam],
      args[strings.prefixParam], flags.debug);
    if (articles.length > 0) {
      this.log(`\n${articles.length} articles\n`)
      CliUx.ux.table(articles, columns, {})
    } else {
      this.error('No articles found.')
    }
  }
}
