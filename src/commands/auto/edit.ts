/* 
  Auto Edit Command
  =================
  Launches the `j2md.json file using default .json file editor
*/

import { Command, Flags } from '@oclif/core'
import child_process = require('child_process');
import fs = require('fs');
import path = require('path');
import os = require('os');

// internal modules
import Strings from '../../strings'

// Create some objects we need to do our work
var strings = new Strings();
var exec = child_process.exec

export default class AutoEdit extends Command {
  static summary = 'Auto Edit';
  static description = 'Launch the default editor for the local configuration file.';
  static aliases = ['aed'];
  static examples = ['<%= config.bin %> <%= command.id %>'];
  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AutoEdit)

    var configFilePath = path.join(process.cwd(), strings.configFileName);
    if (flags.debug) this.log(`Output File: ${configFilePath}`);

    if (fs.existsSync(configFilePath)) {
      // borrowed from https://github.com/johnwargo/make-md/blob/main/make-md.js
      var cmdStr;
      if (os.type().indexOf('Win') === 0) {
        //Are we running on Windows? then use start
        cmdStr = `start ${configFilePath}`;
      } else {
        //OS X or Linux, use open cmdStr = 'open ./' + fileName;
        //Added the -e to help this work better on Linux
        cmdStr = `open -e ./${configFilePath}`;
      }
      if (flags.debug) this.log(`Command String: ${cmdStr}`);

      this.log(`Launching ${configFilePath}`);
      var child = exec(cmdStr, function (error, stdout, stderr) {
        if (error !== null) {
          console.error(`Execution error: ${error}`);
          process.exit(1);
        }
      });
    } else {
      this.error(`Configuration file '${strings.configFileName}' doesn't exist; run the 'auto init' command to create the file.`);
    }
  }
}
