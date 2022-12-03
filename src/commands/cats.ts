// List all of the categories in the export file

import { CliUx, Command, Flags } from '@oclif/core'
// internal modules
import Strings from '../strings';
import { Category } from '../types';
import { getCategories } from '../utils'
var strings = new Strings()

export default class Cats extends Command {
  static summary = 'Category List'
  static description = 'List all the categories in the export file.'
  static aliases = ['c']
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
    const { args, flags } = await this.parse(Cats)

    // @ts-ignore
    const columns: CliUx.Table.Columns = {
      // where `.name` is a property of a data object
      id: { header: 'Id' },
      title: { header: 'Title' },
      path: { header: 'Path' }
    }

    var categories: Category[] = getCategories(args[strings.sourceFolderParam],
      args[strings.prefixParam], flags.debug);;
    if (categories.length > 0) {
      this.log(`\n${categories.length} Categories\n`)
      CliUx.ux.table(categories, columns, {})
    } else {
      this.error('No categories found.')
    }
  }

}
