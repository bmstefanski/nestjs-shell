import {
  PatternParameters,
  SinglePatternParameter,
  SinglePatternParameterWithValue,
} from './type/pattern-parameter.type'

export function mapActualValueToParams(
  patternParams: PatternParameters,
  actualParamsValues: string[],
): SinglePatternParameterWithValue[] {
  const mutablePatternParams = patternParams || []

  const arrayMappedParams = Object.values(mutablePatternParams) as SinglePatternParameter[]
  return arrayMappedParams
    .sort(_ascendingBySignatureIndex)
    .map((arg: SinglePatternParameter) => ({ ...arg, value: _getParamValue(arg, actualParamsValues) }))
}

function _getParamValue(arg: SinglePatternParameter, actualParamsValues: string[]): any {
  return arg.isVarargs ? _joinVarargsIfPresent(actualParamsValues, arg) : _getNormalParam(actualParamsValues, arg)
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
