import fs = require('fs');
import path = require('path');
import { Article, Category } from './types';

const catFileRoot: string = "_categories.json"
const artFileRoot: string = "_content.json"

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
          console.log(`Database: ${obj.database}`)
          console.log(`Table: ${obj.name}`)
          const catsData = obj.data
          // Biuild the category array with just the data we need
          for (var category of catsData) {
            categories.push({
              name: category.title,
              alias: category.alias,
              path: category.path,
              idx: parseInt(category.id)
            })
          }
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
          const artsData = obj.data
          for (var article of artsData) {
            articles.push({
              idx: parseInt(article.id),
              catIdx: parseInt(article.catid),
              name: article.title,
              alias: article.alias,
              created: article.created,
              body: article.introtext,
            })
          }
        }
      }
    } else {
      console.log(`File: "${inputFile}" does not exist.`)
    }
  } else {
    console.log(`Input folder: "${inputFolder}" does not exist.`)
  }
  return articles
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