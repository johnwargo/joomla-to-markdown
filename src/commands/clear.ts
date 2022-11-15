import { Command, Flags } from '@oclif/core'
import fs = require('fs-extra');  // https://www.npmjs.com/package/fs-extra
import path = require('path');
// import * as inquirer from 'inquirer';
// import inquirer from 'inquirer';
// const inquirer = require('inquirer');
import inquirer = require('inquirer');

// internal modules
import Strings from '../strings'
var strings = new Strings()

export default class Clear extends Command {
  static summary = 'Clear'
  static description = 'Delete all markdown files from the output folder.'
  static examples = [strings.oneParamExample]

  static flags = { debug: Flags.boolean({ char: 'd' }) }

  static args = [{
    name: strings.outputFolderParam,
    description: strings.outputFolderDescription,
    required: true
  }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Clear)

    return new Promise(async (resolve, reject) => {
      // does the export folder exist? (it should, I don't want to have to worry about creating it)
      this.log('\nOutput Folder\n=============');
      const outputFolder = path.join('./', args[strings.outputFolderParam]);
      this.log(`Folder: '${outputFolder}'`);
      if (fs.existsSync(outputFolder)) {
        this.log('Folder exists\n');

        // @ts-ignore
        let responses: any = await inquirer.prompt([{
          name: 'stage',
          message: 'select a stage',
          type: 'list',
          choices: [{name: 'development'}, {name: 'staging'}, {name: 'production'}],
        }])
        console.log(responses.stage);

      } else {
        this.error('Output folder does not exist, please create it and try again.');
      }

      //   fs.emptyDirSync(outputFolder);    
    });
  }
}
