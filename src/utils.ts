import fs = require('fs');
import path = require('path');
const parseJSON = require('date-fns/parseJSON');
import Turndown = require('turndown');
const yesno = require('yesno');

import { Article, Category, ConfigObject, ConfigValidation, ProcessResult } from './types';

const catFileRoot: string = "_categories.json"
const artFileRoot: string = "_content.json"

var turndownService = new Turndown();

export function getCategories(inputFolder: string, prefix: string, debug: boolean = false): Category[] {

  var categories: Category[] = []

  if (debug) console.log(`getCategories('${inputFolder}', '${prefix}')`)

  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + catFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    if (debug) console.log(`Input file: "${inputFile}"`)
    // does the input file exist?
    if (fs.existsSync(inputFile)) {
      // read the data from the file
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
      for (var obj of data) {
        if (obj.type == 'table') {
          console.log(`Database: ${obj.database}`);
          console.log(`Table: ${obj.name}`);
          categories = obj.data;
        }
      }
    } else {
      console.log(`File: "${inputFile}" does not exist.`)
    }
  } else {
    console.log(`Input folder: "${inputFolder}" does not exist.`)
  }
  return categories.sort(compareFunction)
}

export function getArticles(inputFolder: string, prefix: string, debug: boolean = false): Article[] {

  var articles: Article[] = []

  if (debug) console.log(`getArticles('${inputFolder}', '${prefix}')`)

  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + artFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    if (debug) console.log(`Input file: "${inputFile}"`)
    // does the input file exist?
    if (fs.existsSync(inputFile)) {
      // read the data from the file
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
      for (var obj of data) {
        if (obj.type == 'table') {
          console.log(`Database: ${obj.database}`)
          console.log(`Table: ${obj.name}`)
          articles = obj.data;
        }
      }
    } else {
      console.log(`File: "${inputFile}" does not exist.`)
    }
  } else {
    console.log(`Input folder: "${inputFolder}" does not exist.`)
  }
  // no need to sort the articles?
  return articles
}

// export type ConfigObject = {
//   databasePrefix: string;
//   inputFolder: string;
//   outputFolder: string;
//   templateFileName?: string;
//   gmtOffset?: number;
// }

const validations: ConfigValidation[] = [
  { propertyName: 'databasePrefix', isRequired: true, isFilePath: false },
  { propertyName: 'inputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'outputFolder', isRequired: true, isFilePath: true },
  { propertyName: 'templateFileName', isRequired: false, isFilePath: true },
  { propertyName: 'gmtOffset', isRequired: true, isFilePath: false },
];

async function validateConfig(config: ConfigObject, debug: boolean = false): Promise<ProcessResult> {

  var processResult: ProcessResult;

  if (debug) console.log(`validateConfig()`);

  processResult = { result: true, message: '\nConfiguration validation encountered the following error(s):\n' };

  for (var validation of validations) {
    if (debug) console.dir(validation);

    console.log(`Validating '${validation.propertyName}'`);

    var propertyValue: any = config[validation.propertyName as keyof ConfigObject];
    if (debug) console.log(`Property value: '${propertyValue}' (type: ${typeof propertyValue})\n`);

    // Do we have a value?
    if (propertyValue != undefined) {
      // is it a required field?
      if (validation.isRequired && propertyValue.toString().length < 1) {
        processResult.result = false;
        processResult.message += `\nThe '${validation.propertyName}' property is required, but not defined.`;
      }
      // is it a file path?
      if (validation.isFilePath && propertyValue.length > 0) {
        const filePath = path.join('./', propertyValue);
        if (!fs.existsSync(filePath)) {
          processResult.result = false;
          processResult.message += `\nThe '${validation.propertyName}' value '${propertyValue}' is not a valid file/path.`;
        }
      }
    } else {
      processResult.result = false;
      processResult.message += `\nUnable to read value for '${validation.propertyName}'.`;
    }
  }
  return processResult;
}

export function processExport(config: ConfigObject, debug: boolean = false): Promise<ProcessResult> {

  var gmtOffset: number = 0;
  var replacements: RegExpMatchArray[] = [];
  var template: string;

  // Returning a promise because long running commands (and this could 
  // be one) should be wrapped in a promise.
  return new Promise((resolve, reject) => {

    // // Check the config file for required properties
    // const validationResult: ProcessResult = await validateConfig(config, debug);
    // // Did validation fail?
    // if (!validationResult.result) {
    //   // The reject the promise with the validation result message - why not?
    //   reject(validationResult);
    // }
    const processResult: ProcessResult = { result: true, message: 'Article Export encountered the following error:\n' };

    validateConfig(config, debug)
      .then((res: ProcessResult) => {
        if (!res.result) {
          reject(res);
        } else {
          console.log('completed validation');
          const outputFolder = path.join('./', config.outputFolder);

          // Do we have a template argument?
          if (config.templateFileName) {
            console.log('Checking template file for replacable tokens\n');
            const templateFile = path.join('./', config.templateFileName);
            template = fs.readFileSync(templateFile, 'utf8');
            // @ts-ignore
            replacements = template.match(/\{\{([^}]+)\}\}/g);
            if (!replacements) {
              processResult.result = false;
              processResult.message += `\nNo replacible tokens found in template file '${config.templateFileName}'.`;
              reject(processResult);
            }
            console.dir(replacements);

            if (config.gmtOffset) {
              if (debug) console.log(`\nGMT Offset: ${config.gmtOffset}`);
            }
          }

          // get all categories
          console.log('\nCategories\n==========');
          var categories: Category[] = getCategories(config.inputFolder, config.databasePrefix, debug);
          if (categories.length > 0) {
            console.log(`Categories: ${categories.length.toLocaleString("en-US")}\n`);
          } else {
            processResult.result = false;
            processResult.message += '\nNo categories found';
            reject(processResult);
          }

          // next get the articles
          console.log('Articles\n========');
          var articles: Article[] = getArticles(config.inputFolder, config.databasePrefix, debug);
          if (articles.length > 0) {
            console.log(`Articles: ${articles.length.toLocaleString("en-US")}\n`)
            yesno({
              question: '\nExport all articles to markdown? Enter yes or no:',
              defaultValue: false,
              yesValues: ['Yes'],
              noValues: ['No']
            }).then((confirmExport: boolean) => {
              if (confirmExport) {
                console.log('Exporting articles...');
                for (var article of articles) {
                  // Strip invalid characters from the article title
                  article.title = article.title.trim().replace(/[\\/:"*?!<>|]+/g, '');
                  // Adjust the created date (if needed)
                  if (config.gmtOffset != 0) {
                    article.created = article.created + " " + calculateOffsetString(config.gmtOffset!, debug);
                  }
                  // Find the category title for this article
                  var category: Category = <Category>categories.find(c => c.id === article.catid);
                  // Set the category title and alias in the article object. category alias is (currently) 
                  // used in the file name
                  // strip colons from the title
                  article.category_title = category ? category.title.replace(/:/g, '') : 'Unknown';
                  article.category_alias = category ? category.alias : 'unknown';
                  if (config.templateFileName) {
                    exportTemplateArticle(article, template, replacements, outputFolder, debug);
                  } else {
                    exportGenericArticle(article, outputFolder, debug);
                  }
                }
              } else {
                processResult.result = false;
                processResult.message += '\nExport cancelled by user';
                reject(processResult);
              }
            });
          } else {
            processResult.result = false;
            processResult.message += '\nNo articles found';
            reject(processResult);
          }
        }
        resolve(processResult);
      })
      .catch((err: ProcessResult) => {
        processResult.result = false;
        processResult.message += err.message;
        reject(processResult);
      });
  });
}

export function exportTemplateArticle(
  article: Article,
  template: string,
  replacements: RegExpMatchArray[],
  outputFolder: string,
  debug: boolean = false) {

  var docBody: string;

  console.log(`\nexportTemplateArticle('${article.title}', template, '${outputFolder}', replacements)`);
  if (debug) console.dir(article);
  // convert the article body to markdown
  article.introtext = turndownService.turndown(article.introtext);
  // copy the template into the document body
  docBody = template;
  // process the replacements
  for (var replacement of replacements) {
    // just in case the template uses mixed case for this property
    var searchText: string = replacement.toString().toLowerCase();
    // strip the braces and any errant spaces
    var propertyName: string = searchText.replace('{{', '').replace('}}', '').trim();
    // get the value of the property
    var propertyValue: any = article[propertyName as keyof Article]?.toString();

    if (debug) {
      console.log(`Category Title: ${article.category_title}`);
      console.log(`\nSearch Text: ${searchText}, property name: ${propertyName}, replace with '${propertyValue}'`);
    }

    if (propertyValue) {      
      // @ts-ignore
      docBody = docBody.replaceAll(searchText, propertyValue);
    }
  }

  if (debug) console.dir(docBody);

  // Calculate the output file name  
  var outputFileName = path.join(outputFolder, buildOutputFileName(article.title, article.created));
  console.log(`Writing file '${outputFileName}'`);
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}

export function exportGenericArticle(
  article: Article,
  outputFolder: string,
  debug: boolean = false) {

  const crlf = '\r\n';
  const threeDashes = '---' + crlf;

  function buildFileString(heading: string, text: string, debug: boolean = false): string {
    var tmpStr = `${heading.trim()}: ${text}${crlf}`
    if (debug) console.log(tmpStr);
    return tmpStr;
  }

  console.log(`exportGenericArticle('${article.title}', '${outputFolder}')`);
  // figure out the output file name
  var outputFileName = path.join(outputFolder, buildOutputFileName(article.title, article.created));
  console.log(`Output File: '${outputFileName}'\n`);
  // build the file content
  var docBody = threeDashes;
  docBody += buildFileString('Title', article.title, debug);
  docBody += buildFileString('ID', article.id.toString(), debug);
  docBody += buildFileString('Alias', article.alias, debug);
  docBody += buildFileString('Category', article.category_title!, debug);
  docBody += buildFileString('Category ID', article.catid, debug);
  docBody += buildFileString('Created', article.created, debug);
  docBody += threeDashes;
  // convert the article body to markdown
  var markdownBody = turndownService.turndown(article.introtext);
  docBody += markdownBody;
  // write the body to the file
  fs.writeFileSync(outputFileName, docBody, {});
}


function calculateOffsetString(offset: number, debug: boolean = false): string {
  if (debug) console.log(`calculateOffsetString(${offset})`);
  const isNegative = offset < 0;
  const offsetValStr = (Math.abs(offset) * 100).toString().padStart(4, '0');
  return isNegative ? '-' + offsetValStr : offsetValStr;
}

function buildOutputFileName(title: string, articleDate: string, debug: boolean = false): string {
  // replace spaces with dashes (kill extra spaces first)
  // @ts-ignore
  var tempTitle = title.toLowerCase().replaceAll('  ', ' ').replaceAll(' ', '-');
  if (debug) console.log(`Temp Title: ${tempTitle}`);
  // convert the date string into a Date/Time object
  var tempDate = parseJSON(articleDate);
  // build the file name
  return `${tempDate.getFullYear()}-${zeroPad(tempDate.getMonth() + 1)}-${zeroPad(tempDate.getDate())}-${tempTitle}.md`;
}

function zeroPad(tmpVal: number, numChars: number = 2): string {
  return tmpVal.toString().padStart(numChars, '0');
}

function compareFunction(a: any, b: any) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}
