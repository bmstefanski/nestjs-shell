import { deepClone } from 'src/helper/deep-clone'
import { getFunctionArgs } from 'src/helper/get-function-args'
import { PatternParameters, SinglePatternParameterWithValue } from './pattern-parameter.type'
import { parsePattern } from './pattern.parser'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'
import { mapActualValueToParams } from './value-to-param.mapper'

export function ShellCommand(options: {
  name: string
  prefix?: string
  description?: string
  pattern?: string
}): MethodDecorator {
  return (target: object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const componentInstance = _getComponentInstance(target.constructor.name)
    const { name, prefix, description, pattern } = options

    const handler = async (input) => {
      const resolvedComponentInstance = await componentInstance
      const commandMethod = resolvedComponentInstance[methodName]
      const patternParams: SinglePatternParameterWithValue[] = _getParsedPatternParams(pattern, commandMethod, input)

      if (_hasAnyRequiredParam(patternParams)) {
        console.log(`Invalid usage: ${prefix + name} ${pattern}`)
        return
      }

      return commandMethod
        .apply(resolvedComponentInstance, _mapParamsToValueOnly(patternParams))
        .then((result) => console.log(result))
    }

    ShellCommandsRegistry.registerCommand({ name, prefix, description, pattern, handler })
  }
}

function _getComponentInstance(componentClassName: string): Promise<ShellComponent> {
  return ShellCommandsRegistry.getComponent(componentClassName).then(_resolveLazyComponent)
}

function _resolveLazyComponent(component: any): any {
  return component.lazyComponent.then((_: any) => Reflect.construct(_unwrapComponent(_), component.args))
}

function _unwrapComponent(wrappedComponent: any): Function {
  return Object.values(wrappedComponent)[0] as Function
}

function _getParsedPatternParams(
  pattern: string,
  commandMethod: Function,
  input: string[],
): SinglePatternParameterWithValue[] {
  let patternParams: PatternParameters | SinglePatternParameterWithValue[] = parsePattern(pattern)
  patternParams = _replaceSignatureIndex(patternParams, getFunctionArgs(commandMethod))
  patternParams = mapActualValueToParams(patternParams, input)
  return patternParams
}

function _replaceSignatureIndex(patternArgs, functionArguments): PatternParameters {
  let mutablePatternArgs: PatternParameters = deepClone(patternArgs)
  functionArguments.forEach((arg, index) => {
    mutablePatternArgs = { ...mutablePatternArgs, [arg]: { ...mutablePatternArgs[arg], signatureIndex: index } }
  })
  return mutablePatternArgs
}

function _hasAnyRequiredParam(patternParams: SinglePatternParameterWithValue[]): boolean {
  const requiredParam = patternParams.find((arg) => arg.isRequired)
  return requiredParam && !requiredParam.value
}

function _mapParamsToValueOnly(patternParams: SinglePatternParameterWithValue[]): string[] {
  return patternParams.map((param) => param.value)
}
