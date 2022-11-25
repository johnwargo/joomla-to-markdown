/* 
  Auto Init Command
  =================
  Writes a default config file to the current folder. When the user populates it with
  their own values, they can export Joomla content to markdown using a simple
  `j2md auto export` command.
*/

import { Command, Flags } from '@oclif/core';
import fs = require('fs');
import path = require('path');

// internal modules
import Strings from '../../strings'
import { ConfigObject } from '../../types';

// Create some objects we need to do our work
var strings = new Strings();

const configObject: ConfigObject = {
  joomlaDatabasePrefix: "",
  inputFolder: ".",
  outputFolder: ".",
  templateFileName: "",
  gmtOffset: 0
}

// TODO: Prompt for all of the config values

export default class AutoInit extends Command {
  static summary = 'Auto Initialize';
  static description = 'Create the local configuration file for the auto command.';
  static aliases = ['ai'];
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AutoInit);

    var outputFilePath = path.join(process.cwd(), strings.configFileName);
    if (flags.debug) this.log(`Output File: ${outputFilePath}`);

    if (fs.existsSync(outputFilePath)) {
      this.error(`Configuration file '${strings.configFileName}' already exists; run the 'auto edit' command to edit the file.`);
    } else {
      if (flags.debug) this.log(`Writing configuration file '${strings.configFileName}'`);
      try {
        fs.writeFileSync(outputFilePath, JSON.stringify(configObject, null, 4), 'utf8');
      } catch (err) {
        this.error(`Error writing file: ${err}`);
      } finally {
        this.log(`Configuration file '${strings.configFileName}' created.`);
      }
    }
  }
}
