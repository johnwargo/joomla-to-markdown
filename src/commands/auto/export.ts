import { Command, Flags } from '@oclif/core'
import fs = require('fs');
import { readFile } from "fs/promises";
import path = require('path');
const yesno = require('yesno');

// internal modules
import { processExport } from '../../utils'
import Strings from '../../strings';
import { ConfigObject, ProcessResult } from '../../types';

// Create some objects we need to do our work
var strings = new Strings();

export default class AutoExport extends Command {
  static summary = 'Auto Export';
  static description = 'Export Joomla article content to markdown files using the configuration options defined in the local configuration file.';
  static aliases = ['ae'];
  static examples = ['<%= config.bin %> <%= command.id %>'];
  static flags = {
    debug: Flags.boolean({ char: 'd' }),
    yeaOnly: Flags.boolean({ char: 'y' })
  }
  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AutoExport);

    const configFileMessageRoot = 'The configuration file';
    const debug: boolean = flags.debug || false;

    if (debug) console.log('Debug mode enabled');

    return new Promise(async (resolve, reject) => {

      // does the config file exist?    
      const configFilePath = path.join('./', strings.configFileName);
      if (debug) this.log(`Checking for config file: '${configFilePath}'`);
      if (fs.existsSync(configFilePath)) {
        this.log(`${configFileMessageRoot} exists`);
      } else {
        this.error(`\n${configFileMessageRoot} does not exist, please create the file\nthen populate it with the required configuration options and try again.`);
      }

      // read the config file
      this.log('\nReading config file...');
      // https://stackoverflow.com/questions/70601733/dynamic-import-with-json-file-doesnt-work-typescript
      const file = await readFile(configFilePath, "utf8");
      var configObject: ConfigObject = JSON.parse(file) as ConfigObject;
      if (configObject) {
        
        if (debug) console.dir(configObject);

        processExport(configObject, flags.debug, flags.yearOnly)
          .then((processResult: ProcessResult) => {
            if (processResult.result) {
              resolve();
            }
          }).catch((error: any) => {
            this.log(error.message);
            reject(error.message);
          });

      } else {
        this.error(`Unable to read the configuration file, please check the file and try again.`);
      }
    });
  }
}
