# Release Notes

## 0.0.14 - 2023-03-19

Added `directoryExists` function to `utils.js` and changed Clear to use it.

## 0.0.13 - 2023-03-19

Cleaned up some issues with the code, especially the format of the short date in the output files frontmatter.

## 0.0.12 - 2023-03-19

Added the `--shortDate` (-z) parameter to deal with how [Eleventy](https://www.11ty.dev/) deals with dates in file names and ignores timestamps in front matter. Added 11ty template. 

## 0.0.7 - 2022-12-03

Added an automated export process driven by a configuration file instead of command-line parameters.

## 0.0.6 - 2022-11-22

Added an optional parameter to the `export` command. The parameter, `gmtOffset` which adds some additional text to the created date in the output file. This is the -0500 shown in the following example:

```text
date:   2022-11-18 15:29:16 -0500
```

## 0.0.5 - 2022-11-20

Updated the export command so it pulls colons (:) from article titles. Y'all will have to let me know if I need to strip other characters from file names.

## 0.0.4 - 2022-11-20

Fixed typos in the readme and other minor fixes.

## 0.0.1 - 2022-11-20

Initial Release.