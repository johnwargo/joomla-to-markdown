// List all of the categories in the export file

import { Command, Flags } from '@oclif/core'
// internal modules
import { Category, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()


export default class Cats extends Command {
  static summary = 'Category List'
  static description = 'List all the categories in the export file.'
  static aliases = ['c']
  static examples = [strings.twoParamExample]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // prefix: Flags.string({char: 'p', description: 'Export file prefix'}),
    // flag with no value (-f, --force)
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
    const { args, flags } = await this.parse(Cats)

    // const debug: boolean = flags.debug
    // if (debug) {
    //   console.log('Debug mode enabled')
    // }

    var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam])
    if (categories.length > 0) {
      this.log(`Categories: ${categories.length}`)
      for (var category of categories) {
        this.log(`${category.name}  (${category.idx}, ${category.path})`)
      }
    } else {
      this.error('No categories found.')
    }
  }

}
