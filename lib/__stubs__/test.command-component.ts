import { ShellComponent } from '../type'

export class TestCommandComponent extends ShellComponent {
  public async noParametersCommand(): Promise<string> {
    return `hello world`
  }

  public async twoParametersCommand(arg1: string, arg2: string): Promise<string> {
    return `arg1: ${arg1} | arg2: ${arg2}`
  }
}
