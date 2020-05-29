import { ShellCommand } from './shell/shell-command.decorator'
import { ShellComponent } from './shell/shell-component'
import { TestClass } from './test-class'

export class TestShellCommand extends ShellComponent {
  private readonly testContent: string

  constructor(private readonly testClass: TestClass) {
    super()

    this.testContent = 'def'
  }

  @ShellCommand({ name: 'abc', pattern: '<testString> [@varargs]', prefix: '.', description: '' })
  public async testCommand(varargs: string, testString: string): Promise<string> {
    return `I've got executed ${testString} and ${varargs}`
  }
}
