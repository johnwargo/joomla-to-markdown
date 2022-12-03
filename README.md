# Export Joomla to Markdown

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
![GitHub](https://img.shields.io/github/license/johnwargo/joomla-to-markdown)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johnwargo/joomla-to-markdown)
![npm](https://img.shields.io/npm/dw/joomla-to-markdown)

<!-- TOC -->

- [Export Joomla to Markdown](#export-joomla-to-markdown)
  - [Preparing for Use](#preparing-for-use)
  - [Modes of Operation](#modes-of-operation)
  - [Commands](#commands)
    - [Articles](#articles)
    - [Auto](#auto)
      - [Init](#init)
      - [Edit](#edit)
      - [Export](#export)
    - [Categories](#categories)
    - [Clear](#clear)
    - [Export](#export)
    - [Statistics](#statistics)
    - [Getting Help Or Making Changes](#getting-help-or-making-changes)

<!-- /TOC -->

The [Joomla!](https://www.joomla.org/) to Markdown (`j2md`) module is a node.js command line utility for converting Joomla 3 article content into markdown files. I needed to migrate an old Joomla 3 site to another platform and wrote this module to handle the heavy lifting for me. I wanted to use something like [Jekyll](https://jekyllrb.com/) or [Eleventy](https://www.11ty.dev/) for my site and knew that both supported markdown files.

**npm Package:**: https://www.npmjs.com/package/joomla-to-markdown

**Note:** This module was only tested against data from a Joomla 3 site running on MySQL; it could very well work with a Joomla 4 site, I just haven't tested it.

To use this module, first install it using the following command:

``` shell
npm install joomla-to-markdown -g
```

**Note:** To use the module without installing it locally, use the following command instead:

``` shell
npx j2md command [parameters]
```

Using the supported commands listed in the following section.

## Preparing for Use

To use the module, you must complete the following steps to export your Joomla data and convert your article content to [Markdown](https://daringfireball.net/projects/markdown/) format:

1. Using MySQL Admin (shown below) or your export tool of choice export your site's `categories` table in JSON format to a local file.
2. Export your site's `content` table in JSON format to a local file.
3. Craft a template file (instructions below) that describes the format of the exported markdown file for each Joomla article.
4. Execute the module's `export` command to convert the contents of the JSON files to individual markdown files for each article.

![MySQL Admin Export Panel](/images/figure-01.png)

The module uses both the Joomla site's `categories` and `content` table content because the article table only contains references to Category names via is category ID. The module must have access to the `categories` table in order to copy over the category name and category alias values when exporting articles.

## Modes of Operation

This module originally shipped with an export process that required users to provide multiple command-line parameters every time they wanted to generate articles. Recognizing that as a user tweaks the export template, they may execute the process many times with the same parameters. To simplify the process for this use case, I added an `auto` command that enables users to drive article export through a configuration file. 

Currently, the module only supports a default configuration file name (`j2md.json`) but I can easily update the module to accept the config file name as an input parameter. 

## Commands

The following sections illustrate how to use to use each of the commands provided by the module.

### Articles

Use `arts` or `a` for this command.

Display a list of article information to the console; the module reads the `content` export file, parses the content then displays each Article Id, Article Title, and Alias in a table. Use this command to validate the contents of the `content` export.

``` shell
j32md arts sourceFolder joomlaDatabasePrefix
```

For example, with all of the Joomla exported content in a folder called `input` and a database prefix of `e3yh9`, you would use the following command:

``` shell
j32md arts input e3yh9
```

**Note:** if you don't have the exported Joomla content in a sub-folder, simply use `.` for the sourceFolder parameter.

The module will read the `e3yh9_content.json` file and display details for each article in a table as shown below:

``` text
 
Database: jmw_cms
Table: e3yh9_content

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

### Auto


#### Init


#### Edit


#### Export


### Categories

Use `cats` or `c` for this command.

Display a list of category information to the console; the module reads the `categories` export file, parses the content then displays each article Id, Name, and Path in a table. Use this command to validate the contents of the `categories` export.

``` shell
j32md cats sourceFolder joomlaDatabasePrefix
```

For example, with all of the Joomla exported content in a folder called `input` and a database prefix of `e3yh9`, you would use the following command:

``` shell
j32md cats input e3yh9
```

**Note:** if you don't have the exported Joomla content in a sub-folder, simply use `.` for the sourceFolder parameter.

The module will read the `e3yh9_categories.json` file and display details for each category in a table as shown below:

``` text
Database: jmw_cms
Table: e3yh9_categories

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

Use `clear` or `x` for this command.

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

Use `export` or `e` for this command.

When you've exported your Joomla site's content and you're ready to create markdown files start by creating a template file the module will use to format the exported markdown files. Since I knew I wanted to run this site on Jekyll (before migrating it to Eleventy), I grabbed the default first post from a new Jekyll site and modified it to use as a template for this module. A portion of the sample post is shown below.

``` yml
---
layout: post
title:  "Welcome to Jekyll!"
date:   2022-11-18 15:29:16 -0500
categories: jekyll update
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

...
```

Remove the body content from the file (the content below the second `---` in the file) and update the YAML content at the top of the file. Use double curly braces around any Joomla `content` table fields you want inserted in the article file when generated. 

In the example below, I used the table's `title` field for the article Title, `created` field for the article date, and `introtext` is the field name for the article's main content.

``` yml
---
layout: post
title:  {{title}}
date:   {{created}}
categories: {{category_title}}
---
{{introtext}}
```

The export process adds two additional fields to the article record that you can use in your template:

* `category_title`: The `categories` table category name for the selected article.
* `category_alias`: The `categories` table alias for the selected article.

In the example above, `category_title` is used to set the Jekyll post category.

Now, with the template file in place, you're ready to export your Joomla articles to markdown files. In a terminal window, execute the following command

``` shell
j32md export sourceFolder joomlaDatabasePrefix destinationFolder templateFile
```

For example, with the following configuration:

* The Joomla exported content JSON files in a folder called `input` 
* The Joomla site's database prefix `e3yh9`
* Output folder `output`
* Template file name `jekyll.md`

Use the following command:

``` shell
j32md export input e3yh9 output jekyll.md
```

The module will create a separate markdown file for each article defined in the exported `content` table; an example of a generated file looks like this:

``` markdown
---
layout: post
title:  Site Upgrade Coming
date:   2022-11-18 15:29:16
categories: Miscellaneous
---
This site runs on Joomla, since, I think, the Joomla 1.x days. The Joomla team recently released Joomla 4 and they're getting ready to shut down support for Joomla 3. In preparation for this, I removed the site map menu and upgraded the SEO engine.

I haven't used attachments in this site in a long time, so I will soon delete the attachments plugin and update all articles that had attachments (10 articles). I'll put a notice on the top of each affected page and, if the attachment is still relevant, store it somewhere else and provide a link to the file's new location.
```

The sample post Jekyll creates for a new site has a GMT offset added to the create date field. To add this to exported markdown files, add a GMT offset to the `export` command as shown in the follwing example:

``` shell
j32md export input e3yh9 output jekyll.md -5
```

This will add `-0500` to the date field as shown in the following example markdown file:

``` markdown
---
layout: post
title:  Site Upgrade Coming
date:   2022-11-18 15:29:16 -0500
categories: Miscellaneous
---
This site runs on Joomla, since, I think, the Joomla 1.x days. The Joomla team recently released Joomla 4 and they're getting ready to shut down support for Joomla 3. In preparation for this, I removed the site map menu and upgraded the SEO engine.

I haven't used attachments in this site in a long time, so I will soon delete the attachments plugin and update all articles that had attachments (10 articles). I'll put a notice on the top of each affected page and, if the attachment is still relevant, store it somewhere else and provide a link to the file's new location.
```

### Statistics

Use `stats` or `s` for this command.

Displays category count and article count for the specified Joomla exported content.  Use this command to determine how many categories and articles are listed in the exported Joomla tables.

``` shell
j32md cats sourceFolder joomlaDatabasePrefix
```

For example, with all of the Joomla exported content in a folder called `input` and a database prefix of `e3yh9`, you would use the following command:

``` shell
j32md stats input e3yh9
```

The module will read the `e3yh9_categories.json` and `e3yh9_content.json` files and displays the record counts in the console as shown below:

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

### Getting Help Or Making Changes

Use [GitHub Issues](https://github.com/johnwargo/joomla-to-markdown/issues) to get help with this module.

Pull Requests gladly accepted, but only with complete documentation of what the change is, why you made it, and why you think its important to have in the module.

If this code helps you: <a href="https://www.buymeacoffee.com/johnwargo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
