import fs = require('fs')
import path = require('path')

const catFileRoot: string = "_categories.json"
const artFileRoot: string = "_content.json"

export type Category = {
  idx: number;
  name: string;
  alias: string;
  path: string;
};

export type Article = {
  idx: number;
  name: string;
  alias: string;
  created: string;
  body: string
};

// Category: {  
//     "id": "2",
//     "asset_id": "27",
//     "parent_id": "18",
//     "lft": "18",
//     "rgt": "19",
//     "level": "2",
//     "path": "category-posts\/category-blackberry",
//     "extension": "com_content",
//     "title": "BlackBerry",
//     "alias": "category-blackberry",
//     "note": "",
//     "description": "<p>Description of the category<\/p>",
//     "published": "1",
//     "checked_out": "0",
//     "checked_out_time": "0000-00-00 00:00:00",
//     "access": "1",
//     "params": "{\"category_layout\":\"\",\"image\":\"\",\"image_alt\":\"\"}",
//     "metadesc": "",
//     "metakey": "",
//     "metadata": "{\"author\":\"\",\"robots\":\"\"}",
//     "created_user_id": "0",
//     "created_time": "0000-00-00 00:00:00",
//     "modified_user_id": "62",
//     "modified_time": "2017-03-02 14:31:45",
//     "hits": "0",
//     "language": "*",
//     "version": "1"
//   },

export function getCategories(inputFolder: string, prefix: string): Category[] {
  var categories: Category[] = []
  console.log(`getCategories('${inputFolder}', '${prefix}')`)
  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + catFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    console.log(`Input file: "${inputFile}"`)
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

export function getArticles(inputFolder: string, prefix: string): Article[] {
  var articles: Article[] = []
  console.log(`getArticles('${inputFolder}', '${prefix}')`)
  // does the input folder exist?
  if (fs.existsSync(inputFolder)) {
    const fileName = prefix + artFileRoot
    const inputFile = inputFolder == '.'
      ? path.join('./', fileName)
      : path.join('./', inputFolder, fileName)
    console.log(`Input file: "${inputFile}"`)
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
              name: article.title,
              alias: article.alias,
              created: article.created,
              body: article.introtext,
              idx: parseInt(article.id)
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