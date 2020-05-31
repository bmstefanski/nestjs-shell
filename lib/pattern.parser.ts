import { PatternParameters } from './type/pattern-parameter.type'

export function parsePattern(pattern: string): PatternParameters {
  const splittedBySpace = pattern.split(' ')
  let results = {}

  splittedBySpace.forEach((rawArg, patternIndex) => {
    const argWithoutBrackets = _removeAllBrackets(rawArg)
    const paramName = _clearParameterName(argWithoutBrackets)
    const isRequired = rawArg.includes('<')
    const isVarargs = argWithoutBrackets.includes('@')

    results = {
      ...results,
      [paramName]: { patternIndex, isRequired, isVarargs, signatureIndex: 0 },
    }
  })

  return results
}

function _removeAllBrackets(value: string): string {
  return value.replace(/\<|\>|\[|\]/g, '')
}

function _clearParameterName(param: string): string {
  return param.replace('@', '')
}
