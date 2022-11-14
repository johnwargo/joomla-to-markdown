import { CliUx, Command, Flags } from '@oclif/core'
// internal modules
import { Article, Category, getArticles, getCategories } from '../utils'
import Strings from '../strings'

type Statistic = {
  property: string;
  value: string;
};

const noneStr = 'None';

var strings = new Strings()
export default class Stats extends Command {
  static summary = 'Statistics'
  static description = 'List statistics for the export files.'
  static aliases = ['s']
  static examples = [strings.twoParamExample]

  static flags = {
    // debug: Flags.boolean({ char: 'd' })  
  }

  static args = [
    {
      name: strings.sourceFolderParam,
      description: strings.sourceFolderDescription,
      required: true
    }, {
      name: strings.prefixParam,
      description: strings.prefixDescription,
      required: true
    }
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Stats)

    // @ts-ignore
    const columns: CliUx.Table.Columns = {
      property: { header: 'Property' },
      value: { header: 'Count' }
    }

    var statistics: Statistic[] = [];
    var statistic: Statistic = { property: '', value: '' };

    this.log(`Source Folder Parameter: ${strings.sourceFolderParam}\n`);

    var categories: Category[] = getCategories(args[strings.sourceFolderParam], args[strings.prefixParam]);
    statistic.property = 'Categories';
    statistic.value = categories.length > 0 ? categories.length.toLocaleString("en-US") : noneStr;
    statistics.push(statistic);
    
    var articles: Article[] = getArticles(args[strings.sourceFolderParam], args[strings.prefixParam]);
    statistic.property = 'Articles';
    statistic.value = articles.length > 0 ? articles.length.toLocaleString("en-US") : noneStr;      
    statistics.push(statistic);

    this.log();
    CliUx.ux.table(statistics, columns, {});
  }
}
