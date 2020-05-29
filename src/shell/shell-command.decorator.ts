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

      const removeBrackets = (value) => value.replace(/\<|\>|\[|\]/g, '')

      let patternArgs = {}
      pattern
        .split(' ')
        .filter((string) => !!string.trim())
        .forEach((rawArg, index) => {
          const replacedArg = removeBrackets(rawArg)
          patternArgs = {
            ...patternArgs,
            [replacedArg.replace('@', '')]: {
              parameterIndex: 0,
              patternIndex: index,
              isRequired: rawArg.includes('<'),
              isVarargs: replacedArg.includes('@'),
            },
          }
        })

      getFunctionArgs(commandMethod).forEach((value, index) => {
        patternArgs = { ...patternArgs, [value]: { ...patternArgs[value], parameterIndex: index } }
      })

      const varArgsPart = (arg) =>
        input.slice(arg.patternIndex).length === 0 ? null : input.slice(arg.patternIndex).join(' ')
      const sortedFunctionArguments = Object.values(patternArgs)
        .sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)
        .map((arg: any) => ({ ...arg, value: arg.isVarargs ? varArgsPart(arg) : input[arg.patternIndex] || null }))
      const requiredPatternArg: any = sortedFunctionArguments.find((arg: any) => arg.isRequired)

      if (requiredPatternArg && !requiredPatternArg.value) {
        console.log(`Invalid usage: ${prefix + name} ${pattern}`)
        return
      }

      return commandMethod
        .apply(
          resolvedComponentInstance,
          sortedFunctionArguments.map((arg: any) => arg.value),
        )
        .then((result) => console.log(result))
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
