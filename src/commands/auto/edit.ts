import {Command, Flags} from '@oclif/core'

export default class AutoEdit extends Command {
  static summary = 'Auto Edit';
  static description = 'Launch the default editor for the local configuration file.';
  static aliases = ['aed'];
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutoEdit)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from D:\\dev\\node\\joomla-to-markdown\\src\\commands\\auto\\edit.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
