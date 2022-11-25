import { Command, Flags } from '@oclif/core'
import fs = require('fs');
import { readFile } from "fs/promises";
import path = require('path');
const yesno = require('yesno');

import Strings from '../../strings';
import { ConfigObject, ConfigValidation } from '../../types';

// Create some objects we need to do our work
var strings = new Strings();

// export type ConfigObject = {
//   joomlaDatabasePrefix: string;
//   inputFolder: string;
//   outputFolder: string;
//   templateFileName: string;
//   gmtOffset: number;
// }

// export type ConfigValidation = {
//   propertyName: string;
//   isRequired: boolean;
//   ifFilePath: boolean;
// }

const configValidations: ConfigValidation[] = [
  { propertyName: 'joomlaDatabasePrefix', isRequired: true, isFilePath: false },
  { propertyName: 'inputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'outputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'templateFileName', isRequired: true, isFilePath: true },
  { propertyName: 'gmtOffset', isRequired: false, isFilePath: false },
];

type ConfigResult = {
  result: boolean;
  message: string;
}

export default class AutoExport extends Command {
  static summary = 'Auto Export';
  static description = 'Export Joomla article content to markdown files using the configuration options defined in the local configuration file.';
  static aliases = ['ae'];
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = { debug: Flags.boolean({ char: 'd' }) };
  static args = [];

  validateConfig(config: ConfigObject): ConfigResult {

    var msgCount = 0;
    var configResult: ConfigResult;
    configResult = { result: true, message: '\nConfiguration validation encountered the following errors:\n' };


    return configResult;
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AutoExport);

    const configFileMessageRoot = 'The configuration file';
    const debug: boolean = flags.debug || false;

    if (debug) this.log('\nDebug mode enabled\n');

    // does the config file exist?    
    const configFilePath = path.join('./', strings.configFileName);
    if (debug) this.log(`Checking for config file: '${configFilePath}'`);
    if (fs.existsSync(configFilePath)) {
      this.log(`${configFileMessageRoot} exists`);
    } else {
      this.error(`\n${configFileMessageRoot} does not exist, please create the file\nthen populate it with the required configuration options and try again.`);
    }

    // read the config file
    this.log('Reading config file...');
    var Config = await readJsonFile(configFilePath) as ConfigObject;
    if (Config) {
      console.dir(Config)
    } else {
      this.error(`Unable to read the configuration file, please check the file and try again.`);
    }

    // Check the config file for required properties
    const validationResult: ConfigResult = this.validateConfig(Config);
    if (validationResult.result) {
      if (debug) this.log('\nConfiguration validation passed');
      // Process the Export
    } else {
      this.error(validationResult.message);
    }
  }
}

// https://stackoverflow.com/questions/70601733/dynamic-import-with-json-file-doesnt-work-typescript
async function readJsonFile(path: string) {
  const file = await readFile(path, "utf8");
  return JSON.parse(file);
}