/* 
  Export Command
  ==============
  Using a template, exports all of the Joomla article content into 
  separate markdown files in the output folder. 
*/

// export the articles
import { Command, Flags } from '@oclif/core'
// var format = require('date-fns/format')
import fs = require('fs');
// import path = require('path');

// internal modules
import { processExport } from '../utils'
import Strings from '../strings';
import { ConfigObject, ProcessResult } from '../types';

// Create some objects we need to do our work
var strings = new Strings();

export default class Export extends Command {
  static summary = 'Export'
  static description = 'Export all articles as markdown files.'
  static aliases = ['e']
  static examples = [strings.fourParamExample]

  static flags = { debug: Flags.boolean({ char: 'd' }) }

  static args = [
    {
      name: strings.sourceFolderParam,
      description: strings.sourceFolderDescription,
      required: true
    }, {
      name: strings.prefixParam,
      description: strings.prefixDescription,
      required: true
    }, {
      name: strings.outputFolderParam,
      description: strings.outputFolderDescription,
      required: true
    },
    {
      name: strings.templateParam,
      description: strings.templateDescription,
      required: false
    },
    {
      name: strings.gmtOffsetParameter,
      description: strings.gmtOffsetDescription,
      required: false
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Export)

    return new Promise((resolve, reject) => {

      const debug: boolean = flags.debug || false;
      if (debug) console.log('Debug mode enabled');

      // if we got this far, we should have all of the required parameters
      var configObject: ConfigObject = {
        databasePrefix: args[strings.prefixParam],
        inputFolder: args[strings.sourceFolderParam],
        outputFolder: args[strings.outputFolderParam],
        templateFileName: args[strings.templateParam] || '',
        gmtOffset: args[strings.gmtOffsetParameter] || 0
      }
      if (debug) console.dir(configObject);

      processExport(configObject, flags.debug)
        .then((processResult: ProcessResult) => {
          if (processResult.result) {
            resolve();
          }
        }).catch((error: any) => {
          this.log(error.message);
          reject();
        });
    });
  }
}
