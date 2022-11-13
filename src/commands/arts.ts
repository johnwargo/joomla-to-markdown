// List all of the articles in the export file

import {Command, Flags} from '@oclif/core'
import { Article, getArticles } from '../utils'

export default class Arts extends Command {
  static summary = 'Article List'
  static description = 'List all the articles in the export file.'
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
    const {args, flags} = await this.parse(Arts)

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
