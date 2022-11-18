import { CliUx, Command, Flags } from '@oclif/core'
// internal modules
import { getArticles, getCategories } from '../utils'
import { Article, Category } from '../types';
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
    var countStr: string;

    var categories: Category[] = getCategories(args[strings.sourceFolderParam],
      args[strings.prefixParam], flags.debug);
    countStr = categories.length > 0 ? categories.length.toLocaleString("en-US") : noneStr;
    statistics.push({ property: 'Categories', value: countStr });
    this.log();

    var articles: Article[] = getArticles(args[strings.sourceFolderParam],
      args[strings.prefixParam], flags.debug);
    countStr = articles.length > 0 ? articles.length.toLocaleString("en-US") : noneStr;
    statistics.push({ property: 'Articles', value: countStr });
    this.log();

    CliUx.ux.table(statistics, columns, {});
  }
}
