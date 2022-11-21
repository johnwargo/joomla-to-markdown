import {Command, Flags} from '@oclif/core'

// TODO: Prompt for all of the config values

export default class AutoInit extends Command {
  static summary = 'Auto Initialize';
  static description = 'Create the local configuration file for the auto command.';
  static aliases = ['ai'];
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutoInit);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from D:\\dev\\node\\joomla-to-markdown\\src\\commands\\auto\\init.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
