import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'

export function ShellCommand(options: { name: string; prefix?: string; description?: string }): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const componentInstance = getComponentInstance(target.constructor.name)

    ShellCommandsRegistry.registerCommand({
      name: options.name,
      prefix: options.prefix,
      description: options.description,
      handler: async (input) => {
        const resolvedComponentInstance = await componentInstance
        const commandMethod = resolvedComponentInstance[propertyKey]

        console.log(await commandMethod.apply(resolvedComponentInstance, ['1', '2']))
      },
    })
  }
}

function getComponentInstance(componentClassName: string): Promise<ShellComponent> {
  return ShellCommandsRegistry.getComponent(componentClassName).then(_resolveLazyComponent)
}

function _resolveLazyComponent(component: any): any {
  return component.lazyComponent.then((_: any) => Reflect.construct(_unwrapComponent(_), component.args))
}

function _unwrapComponent(wrappedComponent: any): Function {
  return Object.values(wrappedComponent)[0] as Function
}
