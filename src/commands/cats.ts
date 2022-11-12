/* eslint-disable object-curly-spacing */
// List all of the categories in the export file

import { Command, Flags } from '@oclif/core'

export default class Cats extends Command {
  static summary = 'Category List'
  static description = 'List all of the categories in the export file.'
  static examples = [
    '<%= config.bin %> <%= command.id %> j3TablePrefix',
    '<%= config.bin %> <%= command.id %> j3TablePrefix -d',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // prefix: Flags.string({char: 'p', description: 'Export file prefix'}),
    // flag with no value (-f, --force)
    debug: Flags.boolean({ char: 'd' }),
  }

  static args = [{ name: 'prefix', required: true, description: 'Joomla table export file prefix' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Cats)

    const debug: boolean = flags.debug

    if (debug) {
      console.log('Debug mode enabled')
    }

    const prefix: string = args.prefix || ''
    if (prefix.length > 0) {
      console.log(`Prefix: ${prefix}`)
    } else {
      console.log('No prefix specified')
    }
  }
}