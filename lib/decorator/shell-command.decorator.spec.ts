import { ShellRegistry } from '../shell.registry'
import { CommandDecoratorOptions, ShellComponent } from '../type'
import { TestCommandComponent } from '../__stubs__/test.command-component'
import { ShellCommand } from './shell-command.decorator'

const executeCommand = async (
  name: string,
  args?: string[],
  printer: (value: any) => any = () => {},
  wrongUsageMessage?: string,
) => {
  await ShellRegistry.findCommand(name).handler(args, { wrongUsage: wrongUsageMessage }, printer)
}

const registerComponentAndDecorateCommand = (
  component: ShellComponent,
  methodName: string,
  decoratorOptions: CommandDecoratorOptions,
) => {
  ShellRegistry.registerComponent(component)
  ShellCommand(decoratorOptions)(component, methodName, null)
}

describe('ShellCommand', () => {
  it('should register the command', () => {
    const componentInstance = new TestCommandComponent()

    ShellCommand({ name: 'test' })(componentInstance, 'noParametersCommand', null)

    expect(ShellRegistry.getImmutableCommands()).toStrictEqual([
      { name: 'test', pattern: '', prefix: '', description: '' },
    ])
  })

  it(`should execute component's method bonded to the command`, async () => {
    const componentInstance = new TestCommandComponent()
    const commandMethodSpy = jest.spyOn(componentInstance, 'twoParametersCommand')

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', { name: 'test' })
    await executeCommand('test')

    expect(commandMethodSpy).toBeCalled()
  })

  it('should return concatenated values of two required pattern parameters', async () => {
    const componentInstance = new TestCommandComponent()
    let results = ''

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', {
      name: 'test',
      pattern: '<arg1> <arg2>',
    })
    await executeCommand('test', ['first', 'second'], (v) => (results = v))

    expect(results).toStrictEqual(`arg1: first | arg2: second`)
  })

  it('should bind oposite placed pattern parameters to proper arguments', async () => {
    const componentInstance = new TestCommandComponent()
    let results = ''

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', {
      name: 'test',
      pattern: '<arg2> <@arg1>',
    })
    await executeCommand('test', ['first_arg', 'second', 'is', 'varargs'], (v) => (results = v))

    expect(results).toStrictEqual(`arg1: second is varargs | arg2: first_arg`)
  })

  it('should print wrong usage message when required param has no value', async () => {
    const componentInstance = new TestCommandComponent()
    let results = ''

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', {
      name: 'test',
      pattern: '<arg1>',
    })
    await executeCommand('test', [], (v) => (results = v), 'Wrong usage: $command $pattern')

    expect(results).toStrictEqual('Wrong usage: test <arg1>')
  })

  it('should throw an error when pattern param has no equivalent in actual (function) params', async () => {
    const componentInstance = new TestCommandComponent()

    registerComponentAndDecorateCommand(componentInstance, 'noParametersCommand', {
      name: 'test',
      pattern: '<someCoolParam> [someCoolNextParam]',
    })
    const executeCommandPromise = executeCommand('test', ['hello'])

    await expect(executeCommandPromise).rejects.toThrowError(
      'Parameter specified in pattern has no equaivalent in actual parameters [Param name: someCoolNextParam]',
    )
  })

  it('should execute without specifying optional pattern param', async () => {
    const componentInstance = new TestCommandComponent()
    let results = ''

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', {
      name: 'test',
      pattern: '[someOptionalParam]',
    })
    await executeCommand('test', [], (v) => (results = v))

    expect(results).toStrictEqual('arg1: null | arg2: null')
  })

  it('should respect required parameter even when it is not first', async () => {
    const componentInstance = new TestCommandComponent()
    let results = ''

    registerComponentAndDecorateCommand(componentInstance, 'twoParametersCommand', {
      name: 'test',
      pattern: '<arg1> <arg2>',
    })
    await executeCommand('test', ['123'], (v) => (results = v), 'Wrong usage: $command $pattern')

    expect(results).toStrictEqual('Wrong usage: test <arg1> <arg2>')
  })
})
