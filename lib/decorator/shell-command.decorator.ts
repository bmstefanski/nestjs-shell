import { deepClone, getFunctionArgs } from '../helper'
import { parsePattern } from '../pattern.parser'
import { ShellRegistry } from '../shell.registry'
import { PatternParameters, SinglePatternParameterWithValue } from '../type/pattern-parameter.type'
import { mapActualValueToParams } from '../value-to-param.mapper'

export function ShellCommand(options: {
  name: string
  prefix?: string
  description?: string
  pattern?: string
}): MethodDecorator {
  return (target: object, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const { name, prefix = '', description = '', pattern = '' } = options

    const handler = async (input, messages, print) => {
      const componentInstance = ShellRegistry.getComponent(target.constructor.name)
      const commandMethod = componentInstance[methodName]
      const patternParams: SinglePatternParameterWithValue[] = _getParsedPatternParams(pattern, commandMethod, input)

      if (_hasAnyRequiredParam(patternParams)) {
        const commandName = (prefix || '') + name
        print(messages.wrongUsage.replace('$command', commandName).replace('$pattern', pattern))
        return
      }

      return commandMethod
        .apply(componentInstance, _mapParamsToValueOnly(patternParams))
        .then((result) => print(result))
    }

    ShellRegistry.registerCommand({ name, prefix, description, pattern, handler })
  }
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
