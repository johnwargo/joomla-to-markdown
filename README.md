# Export Joomla to Markdown

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

Shields options once public: https://shields.io/
<!-- [![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world) -->
<!-- [![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main) -->
<!-- [![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/johnwargo/joomla3-2-markdown/blob/main/package.json) -->

The [Joomla 3](https://www.joomla.org/) to Markdown (`j32md`) module is a node.js command line utility for converting Joomla 3 article content into markdown files. I needed to migrate an old Jomla 3 site to another platform and wrote this module to handle the heavy lifting for me. I wanted to use something like [Jekyll](https://jekyllrb.com/) or [Eleventy](https://www.11ty.dev/) for my site and knew that both supported markdown files.

**Note:** This module was only tested against data from a Joomla 3 site running on MySQL; it could very well work with a Joomla 4 site, I just haven't tested it.

To use this module, first install it using the following command:

``` shell
npm install j2md -g
```

Next, complete the following steps to export your Joomla data and convert your article content to [Markdown](https://daringfireball.net/projects/markdown/) format:

1. Export your site's `categories` table in JSON format to a local file
2. Export your site's `content` table in JDON format to a local file
3. Craft a template file (instructions below) that describes the format of the exported markdown file for each Joomla article
4. Execute the module's `export` command to convert the contents of the JSON files to individual markdown files for each article.

The module uses both the Joomla site's `catergories` and `content` table content because the article table only contains references to Category names via is category ID. The module must have access to the `categories` table in order to copy over the category name and category alias values when exporting articles.

## Commands

The following sections illustrate how to use to use each of the commands provided by the module.

### Articles

Display a list of article information to the console; the module reads the `content` export file, parses the content then displays each article Id, Title, and Alias in a table. Use this command to validate the contents of the `content` export.

``` shell
j32md arts sourceFolder joomlaDatabasePrefix
```

For example, with all of the Joomla exported content in a folder called `input` and a database prefix of `e4hy6`, you would use the following command:

``` shell
j32md arts input e4hy6
```

**Note:** if you don't have the exported Joomla content in a sub-folder, simply use `.` for the sourceFolder parameter.

The module will read the `e4hy6_content.json` file and display details for each article in a table as shown below:

``` text
 
Database: jmw_cms
Table: e4hy6_content

515 articles

 Id  Title                                                    Alias                                                                  
 ─── ──────────────────────────────────────────────────────── ───────────────────────
 1   Broken Display & 507 Error                               brokenscreen 
 3   About                                                    about
 4   Lotus Notes Local Encryption Gotcha                      localencryption
 6   Interesting BES 5.0 Upgrade  Fact                        bes50upgrade
 7   Debugging BlackBerry Applications on Vista 64-Bit        bbonvista64
 8   DeviceInfo.isInHolster()                                 isinholster
 9   Joomla is Amazing!                                       joomlaisamazing
 10  Grammar Checking Source Files?                           grammar
 .
 .
 .                          
 555 Site Upgrade Coming                                      site-upgrade-coming
------------------------------------------------------------- -----------------------

```

### Categories

Display a list of category information to the console; the module reads the `categories` export file, parses the content then displays each article Id, Name, and Path in a table. Use this command to validate the contents of the `categories` export.

``` shell
j32md cats sourceFolder joomlaDatabasePrefix
```

For example, with all of the Joomla exported content in a folder called `input` and a database prefix of `e4hy6`, you would use the following command:

``` shell
j32md cats input e4hy6
```

**Note:** if you don't have the exported Joomla content in a sub-folder, simply use `.` for the sourceFolder parameter.

The module will read the `e4hy6_categories.json` file and display details for each category in a table as shown below:

``` text
Database: jmw_cms
Table: e4hy6_categories

35 Categories

 Idx Title                      Path                                                      
 ─── ────────────────────────── ────────────────────────────────────────────────────────── 
 37  Apache Cordova             category-posts/category-mobile-development/apache-cordova
 2   BlackBerry                 category-posts/category-blackberry
 38  BlackBerry Development     category-posts/category-mobile-development/blackberry-dev
 39  Code Projects              code-projects
 8   Content Management Systems category-posts/category-cms
 36  Guests                     category-posts/category-guests
 3   IBM Lotus Domino           category-posts/category-domino                            
 41  Internet of Things (IoT)   category-posts/category-iot
 9   Miscellaneous              category-posts/category-miscellaneous
 15  Mobile                     category-posts/category-mobile
 14  Mobile Development         category-posts/category-mobile-development
 18  Posts                      category-posts
 -----------------------------------------------------------------------------------------
```

### Clear

Empties (clears) the contents of the output folder where the module writes article markdown files. Use this command to delete all of the exported article files as you try out different template versions or files.

> **Warning** 
> The `clear` command deletes all of the files in the specified folder, so use this command carefully. 

**Note:** The module automatically overwrites existing files in the output folder, so there's really no need to ever use this command :-)

``` shell
j32md clear outputFolder
```

For example, with all of the exported article markdown files in a folder called `output`, you would use the following command:

``` shell
j32md clear output
```

### Export


### Statistics

command

``` shell
j32md stats input e4hy6
```

results

``` text
Database: my_cms
Table: e4hy3_categories

Database: my_cms
Table: e4hy3_content

 Property   Count 
 ────────── ───── 
 Categories 35
 Articles   515
```

