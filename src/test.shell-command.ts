import { ShellCommand } from './shell/shell-command.decorator'
import { ShellComponent } from './shell/shell-component'
import { TestClass } from './test-class'

export class TestShellCommand extends ShellComponent {
  private readonly testContent: string

  constructor(private readonly testClass: TestClass) {
    super()
    this.testContent = 'def'
  }

  @ShellCommand({ name: 'abc', pattern: '<testString> <testString2> [@varargs]', prefix: '.', description: '' })
  public async testCommand(testString2: string, varargs: string, testString: string): Promise<string> {
    return `I've got executed ${testString} and ${varargs}`
  }
}
