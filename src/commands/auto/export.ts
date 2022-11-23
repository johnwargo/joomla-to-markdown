import {Command, Flags} from '@oclif/core'

export default class AutoExport extends Command {
  static summary = 'Auto Export';
  static description = 'Export Joomla article content to markdown files using the configuration options defined in the local configuration file.';
  static aliases = ['ae'];
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutoExport)

   
  }
}
