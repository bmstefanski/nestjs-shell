import { ShellCommandsRegistry } from './shell-commands.registry'

export function ShellCommand(options: { name: string; prefix?: string; description?: string }): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const component = ShellCommandsRegistry.getComponent(target.constructor.name)
    component.then((comp) => {
      comp.lazyComponent.then((lazyComp) => {
        const functionWithClass = Object.values(lazyComp)[0]
        const componentInstance = Reflect.construct(functionWithClass, comp.args)

        ShellCommandsRegistry.registerCommand({
          name: options.name,
          prefix: options.prefix,
          description: options.description,
          handler: async (input) => {
            console.log(await componentInstance[propertyKey].apply(componentInstance, ['1', '2']))
          },
        })
      })
    })
  }
}
