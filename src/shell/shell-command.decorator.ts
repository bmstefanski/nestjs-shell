import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'

export function ShellCommand(options: {
  name: string
  pattern: string
  prefix?: string
  description?: string
}): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const componentInstance = getComponentInstance(target.constructor.name)
    const { name, prefix, description } = options

    const handler = async (input) => handleAsyncCommand(componentInstance, propertyKey, input)
    ShellCommandsRegistry.registerCommand({ name, prefix, description, handler })
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

async function handleAsyncCommand(
  componentInstance: Promise<ShellComponent>,
  methodName: string | symbol,
  input: string,
): Promise<void> {
  const resolvedComponentInstance = await componentInstance
  const commandMethod = resolvedComponentInstance[methodName]

  return commandMethod.apply(resolvedComponentInstance, ['1', '2']).then((result) => console.log(result))
}
