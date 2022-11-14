// List all of the categories in the export file

import { CliUx, Command, Flags } from '@oclif/core'
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

    // @ts-ignore
    const columns: CliUx.Table.Columns = {
      // where `.name` is a property of a data object
      idx: { header: 'Idx' },
      name: { header: 'Category' },
      path: { header: 'Path' }
    }

    var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam])
    if (categories.length > 0) {
      this.log(`\n${categories.length} Categories`)
      // for (var category of categories) {
      //   this.log(`${category.name}  (${category.idx}, ${category.path})`)
      // }
      this.log()
      CliUx.ux.table(categories, columns, {})
    } else {
      this.error('No categories found.')
    }
  }

}
