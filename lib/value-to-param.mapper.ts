import {
  PatternParameters,
  SinglePatternParameter,
  SinglePatternParameterWithValue,
} from './type/pattern-parameter.type'

export function mapActualValueToParams(
  patternParams: PatternParameters,
  actualValue: string[],
): SinglePatternParameterWithValue[] {
  const arrayMappedParams = Object.values(patternParams) as SinglePatternParameter[]
  const value = (arg) => (arg.isVarargs ? _joinVarargsIfPresent(actualValue, arg) : _getNormalParam(actualValue, arg))

  return arrayMappedParams
    .sort(_ascendingBySignatureIndex)
    .map((arg: SinglePatternParameter) => ({ ...arg, value: value(arg) }))
}

function _joinVarargsIfPresent(actualValue: string[], arg: SinglePatternParameter): string | null {
  const chunkedVarargs = actualValue.slice(arg.patternIndex)
  return chunkedVarargs.length === 0 ? null : chunkedVarargs.join(' ')
}

function _getNormalParam(actualValue: string[], arg: SinglePatternParameter): string | null {
  return actualValue[arg.patternIndex] || null
}

function _ascendingBySignatureIndex(a: SinglePatternParameter, b: SinglePatternParameter): number {
  return a.signatureIndex - b.signatureIndex
}
