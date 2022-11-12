// List all of the categories in the export file

import { Command, Flags } from '@oclif/core'
import fs = require('fs')
import path = require('path')

const catFileRoot: string = "_categories.json"

export default class Cats extends Command {
  static summary = 'Category List'
  static description = 'List all the categories in the export file.'
  static examples = [
    '<%= config.bin %> <%= command.id %> inputFolder j3TablePrefix',
    '<%= config.bin %> <%= command.id %> inputFolder j3TablePrefix -d',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // prefix: Flags.string({char: 'p', description: 'Export file prefix'}),
    // flag with no value (-f, --force)
    debug: Flags.boolean({ char: 'd' }),
  }

  static args = [
    {
      name: 'folder', required: true,
      description: 'The name of the folder where the Joomla table export files are stored (use . for current folder).'
    },
    { name: 'prefix', required: true, description: 'Joomla table export file prefix.' }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Cats)

    const debug: boolean = flags.debug

    if (debug) {
      console.log('Debug mode enabled')
    }

    const inputFolder: string = args.folder
    console.log(`Input folder: "${inputFolder}"`)
    // does the input folder exist?
    if (fs.existsSync(inputFolder)) {
      console.log(`Input folder "${inputFolder}" exists.`)

      const fileName = args.prefix + catFileRoot
      const inputFile = inputFolder == '.' ? './' + fileName : path.join(inputFolder, fileName)

      console.log(`Input file: "${inputFile}"`)
    } else {
      console.log(`Input folder "${inputFolder}" does not exist.`)
    }
  }
}
