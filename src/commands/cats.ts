// List all of the categories in the export file

import { Command, Flags } from '@oclif/core'
import { Category, getCategories } from '../utils'
import Strings from '../strings'
var strings = new Strings()


export default class Cats extends Command {
  static summary = 'Category List'
  static description = 'List all the categories in the export file.'
  static examples = [strings.twoParamExample]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // prefix: Flags.string({char: 'p', description: 'Export file prefix'}),
    // flag with no value (-f, --force)
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
    const { args, flags } = await this.parse(Cats)

    // const debug: boolean = flags.debug
    // if (debug) {
    //   console.log('Debug mode enabled')
    // }

    var categories: Category[] = getCategories(args.folder, args.prefix)
    if (categories.length > 0) {
      console.log(`Categories: ${categories.length}`)
      for (var category of categories) {
        console.log(`${category.name}  (${category.idx}, ${category.path})`)
      }
    } else {
      console.log('No categories found.')
    }
  }

}
