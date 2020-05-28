import { ShellArg } from './shell/shell-arg.decorator'
import { ShellCommand } from './shell/shell-command.decorator'
import { ShellComponent } from './shell/shell-component'
import { TestClass } from './test-class'

export class TestShellCommand extends ShellComponent {
  private readonly testContent: string

  constructor(private readonly testClass: TestClass) {
    super()

    this.testContent = 'def'
  }

  @ShellCommand({ name: 'abc', prefix: '', description: '' })
  public async testCommand(
    @ShellArg({ from: 0, to: 1 }) testString: string,
    @ShellArg({ from: 0 }) varargs: string,
  ): Promise<string> {
    console.log(this.testClass)
    console.log(this.testContent)
    return `I've got executed ${testString} and ${varargs}`
  }
}
