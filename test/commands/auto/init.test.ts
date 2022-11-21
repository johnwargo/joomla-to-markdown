import {expect, test} from '@oclif/test'

describe('auto/init', () => {
  test
  .stdout()
  .command(['auto/init'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['auto/init', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
