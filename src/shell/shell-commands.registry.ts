import { ShellComponent } from './shell-component'

type Component = { lazyComponent: Promise<typeof ShellComponent>; args: any[] }
type Command = { name: string; prefix: string; description: string; handler: InputHandler }
type InputHandler = (input: string) => any

export class ShellCommandsRegistry {
  private static readonly COMPONENTS: Component[] = []
  private static commands: { [commandNameWithPrefix: string]: Command } = {}

  private constructor() {}

  public static registerComponent(details: { componentFile: () => Promise<any>; args: any[] }): void {
    const importResults = details.componentFile() as Promise<typeof ShellComponent>

    this.COMPONENTS.push({ lazyComponent: importResults, args: details.args })
    console.log('executed')
  }

  public static getComponent(componentClassName: string): Promise<Component> {
    return Promise.all(this.COMPONENTS).then((originalComponents) => {
      return originalComponents.find((singleOriginalComponent) => {
        return singleOriginalComponent.lazyComponent.then((lazyComponent) => {
          const lazyComponentClassName = Object.keys(lazyComponent)[0]
          return lazyComponentClassName === componentClassName
        })
      })
    })

    return null
    // return this.COMPONENTS.find((originalComponent) => originalComponentClassName === componentClassName)
    // return results.find((originalComponent) => {
    // const originalComponentClassName = Object.keys(originalComponent)[0]
    // return originalComponentClassName === componentClassName
    // })
  }

  public static registerCommand(command: Command): void {
    const prefixedCommand = command.prefix + command.name
    this.commands = { ...this.commands, [prefixedCommand]: command }
  }

  public static findCommand(commandWithPrefix: string): Command {
    return this.commands[commandWithPrefix]
  }
}
