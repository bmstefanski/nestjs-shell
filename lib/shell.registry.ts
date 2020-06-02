import { deepClone } from './helper'
import { Command, ImmutableCommand, ShellComponent } from './type'

type Components = { [name: string]: ShellComponent }
type Commands = { [nameWithPrefix: string]: Command }

export class ShellRegistry {
  private static components: Components = {}
  private static commands: Commands = {}

  private constructor() {}

  public static registerComponent(component: ShellComponent): void {
    this.ensureComponentIsTruthy(component)
    const componentClassName = component.constructor.name
    this.components = { ...this.components, [componentClassName]: component }
  }

  private static ensureComponentIsTruthy(component: ShellComponent): void {
    if (!component) {
      throw new Error(`Component you're trying to register has falsy value (probably null or undefined)`)
    }
  }

  public static getComponent(componentClassName: string): ShellComponent {
    return this.components[componentClassName]
  }

  public static registerCommand(command: Command): void {
    this.ensureCommandIsTruthy(command)
    const prefixedCommand = command.prefix + command.name
    this.commands = { ...this.commands, [prefixedCommand]: command }
  }

  private static ensureCommandIsTruthy(command: Command): void {
    if (!command || (command && !command.name)) {
      throw new Error(
        `Cannot register command because its value or name is falsy (it may be empty command name in @ShellCommand decorator)`,
      )
    }
  }

  public static findCommand(commandWithPrefix: string): Command {
    return this.commands[commandWithPrefix]
  }

  public static getImmutableComponents(): string[] {
    return Object.keys(deepClone(this.components))
  }

  public static getImmutableCommands(): ImmutableCommand[] {
    return this.convertCommandsToArray(deepClone(this.commands))
  }

  private static convertCommandsToArray(commandsInObject: Commands): ImmutableCommand[] {
    return Object.entries(commandsInObject).map((entry) => ({ ...entry[1], name: entry[0] }))
  }
}
