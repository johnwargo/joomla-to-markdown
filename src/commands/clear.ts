import { Command, Flags } from '@oclif/core'
import fs = require('fs-extra');  // https://www.npmjs.com/package/fs-extra
import path = require('path');
const yesno = require('yesno');

// internal modules
import Strings from '../strings'
var strings = new Strings()

export default class Clear extends Command {
  static summary = 'Clear'
  static description = 'Delete all markdown files from the output folder.'
  static aliases = ['x'];
  static examples = [strings.oneParamExample];

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
      const outputFolder = path.join('./', args[strings.outputFolderParam]);
      if (fs.existsSync(outputFolder)) {
        this.log(`Folder '${outputFolder}' exists`);
        // Make sure the user wants to delete the files
        const confirmDelete = await yesno({
          question: '\nDelete all files from the output folder? Enter yes or no:',
          defaultValue: false,
          yesValues: ['Yes'],
          noValues: ['No']
        });
        if (confirmDelete) {
          this.log('Deleting files...');
          fs.emptyDirSync(outputFolder);
        } else {
          this.log('Deletion cancelled');
        }
      } else {
        this.error(`Output folder '${outputFolder}' does not exist, please create it and try again.`);
      }
    });
  }
}
