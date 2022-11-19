export default class Strings {
  exportFolderDescription = 'The folder location for exported markdown files; use . for current folder.';
  outputFolderParam = 'outputFolder';
  outputFolderDescription = 'The target folder for the exported articles files (markdown format).';
  prefixParam = 'prefix';
  prefixDescription = 'Joomla table export file prefix.';
  sourceFolderParam = 'sourcefolder';
  sourceFolderDescription = 'The folder location for the Joomla table export files; use . for current folder.';
  templateParam = 'template';
  templateDescription = 'The template file to use for the exported articles.';
  oneParamExample = '<%= config.bin %> <%= command.id %> outputFolder';
  twoParamExample = '<%= config.bin %> <%= command.id %> sourceFolder j3TablePrefix';
  fourParamExample = '<%= config.bin %> <%= command.id %> sourceFolder j3TablePrefix outputFolder templateFilePath';
}