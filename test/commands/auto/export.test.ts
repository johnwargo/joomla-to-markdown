import {expect, test} from '@oclif/test'

describe('auto/export', () => {
  test
  .stdout()
  .command(['auto/export'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['auto/export', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
