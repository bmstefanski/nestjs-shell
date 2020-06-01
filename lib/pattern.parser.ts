import { PatternParameters, SinglePatternParameter } from './type/pattern-parameter.type'

export function parsePattern(pattern: string): PatternParameters {
  const splittedBySpace = pattern.split(' ')
  let results = {}

  if (!pattern || _hasAnyInvalidParam(splittedBySpace)) {
    return results
  }

  splittedBySpace.forEach((rawParam, index) => {
    results = { ...results, ..._mapParamToProperFormat(rawParam, index) }
  })

  return results
}

function _hasAnyInvalidParam(params: string[]): boolean {
  const matchInvalidCharacters = /[^A-Za-z0-9_\[\]\<\>\@]+/
  return params.some((param) => matchInvalidCharacters.test(param))
}

function _mapParamToProperFormat(param: string, patternIndex: number): PatternParameters {
  const argWithoutBrackets = _removeAllBrackets(param)
  const paramName = _clearParameterName(argWithoutBrackets)
  const isRequired = param.includes('<')
  const isVarargs = argWithoutBrackets.includes('@')

  return { [paramName]: { patternIndex, isRequired, isVarargs, signatureIndex: 0 } }
}

function _removeAllBrackets(value: string): string {
  return value.replace(/\<|\>|\[|\]/g, '')
}

function _clearParameterName(param: string): string {
  return param.replace('@', '')
}
