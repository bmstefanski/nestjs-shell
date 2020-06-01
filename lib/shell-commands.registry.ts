import { ShellComponent } from './shell-component'
import { Command } from './type/command.type'

export class ShellCommandsRegistry {
  private static components: { [name: string]: ShellComponent } = {}
  private static commands: { [commandNameWithPrefix: string]: Command } = {}

  private constructor() {}

  public static registerComponent(component: ShellComponent): void {
    const componentClassName = component.constructor.name
    console.log(componentClassName)
    this.components = { ...this.components, [componentClassName]: component }
  }

  public static getComponent(componentClassName: string): ShellComponent {
    return this.components[componentClassName]
  }

  public static registerCommand(command: Command): void {
    const prefixedCommand = command.prefix + command.name
    this.commands = { ...this.commands, [prefixedCommand]: command }
  }

  public static findCommand(commandWithPrefix: string): Command {
    return this.commands[commandWithPrefix]
  }
}
