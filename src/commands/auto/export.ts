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

const validations: ConfigValidation[] = [
  { propertyName: 'joomlaDatabasePrefix', isRequired: true, isFilePath: false },
  { propertyName: 'inputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'outputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'templateFileName', isRequired: true, isFilePath: true },
  { propertyName: 'gmtOffset', isRequired: false, isFilePath: false },
];

type ValidationResult = {
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

  validateConfig(config: ConfigObject, debug: boolean = false): ValidationResult {

    var validationResult: ValidationResult;
    validationResult = { result: true, message: '\nConfiguration validation encountered the following errors:\n' };

    for (var validation of validations) {
      if (validation.isRequired) {
        // @ts-ignore
        var propertyValue = config[validation.propertyName];
        if (debug) this.log(`Checking for required property: '${validation.propertyName}'`);
        if (propertyValue.length > 0) {
          // we have a value, is it a file path?
          if (validation.isFilePath) {
            const filePath = path.join('./', propertyValue);
            if (!fs.existsSync(filePath)) {
              validationResult.result = false;
              validationResult.message += `\n${validation.propertyName} is not a valid file/path.`;
            }
          } else {
            validationResult.result = false;
            validationResult.message += `\nThe '${validation.propertyName}' property is required but is not defined.`;
          }
        }
      }
    }
    return validationResult;
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
    const validationResult: ValidationResult = this.validateConfig(Config, debug);
    if (validationResult.result) {
      if (debug) this.log('\nConfiguration validation passed!');
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