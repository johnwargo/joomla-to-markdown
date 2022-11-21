import {expect, test} from '@oclif/test'

describe('auto/edit', () => {
  test
  .stdout()
  .command(['auto/edit'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['auto/edit', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
