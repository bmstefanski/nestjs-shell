import { getFunctionArgs } from 'src/helper/get-function-args'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'

export function ShellCommand(options: {
  name: string
  prefix?: string
  description?: string
  pattern?: string
}): MethodDecorator {
  return (target: object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const componentInstance = getComponentInstance(target.constructor.name)
    const { name, prefix, description, pattern } = options

    const handler = async (input) => {
      const resolvedComponentInstance = await componentInstance
      const commandMethod = resolvedComponentInstance[methodName]

      let patternArgs = {}
      pattern
        .split(/\<([^>]+)\>/g)
        .filter((string) => !!string.trim())
        .forEach((arg) => {
          patternArgs = { ...patternArgs, [arg.replace('@', '')]: { index: 0, isVarargs: arg.includes('@') } }
        })

      const functionArgs = getFunctionArgs(commandMethod)

      functionArgs.forEach((value, index) => {
        patternArgs = { ...patternArgs, [value]: { ...patternArgs[value], index } }
      })

      console.log(patternArgs)

      return commandMethod.apply(resolvedComponentInstance, ['1', '2']).then((result) => console.log(result))
    }

    ShellCommandsRegistry.registerCommand({ name, prefix, description, pattern, handler })
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
