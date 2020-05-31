import { Command } from './command.type'
import { Component } from './component.type'
import { ShellComponent } from './shell-component'

export class ShellCommandsRegistry {
  private static readonly COMPONENTS: Component[] = []
  private static commands: { [commandNameWithPrefix: string]: Command } = {}

  private constructor() {}

  public static registerComponent(options: { componentFile: () => Promise<any>; args: any[] }): void {
    const importResults = options.componentFile() as Promise<typeof ShellComponent>
    this.COMPONENTS.push({ lazyComponent: importResults, args: options.args })
  }

  public static getComponent(componentClassName: string): Promise<Component> {
    return this.findInComponents((component) => this.componentWithNameSameAsSpecified(component, componentClassName))
  }

  private static findInComponents(predicate: (value: Component) => Promise<boolean>): Promise<Component | undefined> {
    const find = (promiseWrappedComponents) => promiseWrappedComponents.find((_: Component) => predicate(_))
    return Promise.all(this.COMPONENTS).then(find)
  }

  private static componentWithNameSameAsSpecified(component: Component, componentClassName: string): Promise<boolean> {
    return component.lazyComponent.then((lazyComponent) => {
      const lazyComponentClassName = Object.keys(lazyComponent)[0]
      return lazyComponentClassName === componentClassName
    })
  }

  public static registerCommand(command: Command): void {
    const prefixedCommand = command.prefix + command.name
    this.commands = { ...this.commands, [prefixedCommand]: command }
  }

  public static findCommand(commandWithPrefix: string): Command {
    return this.commands[commandWithPrefix]
  }
}
