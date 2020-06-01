import { mapActualValueToParams } from './value-to-param.mapper'

describe('mapActualValueToParams', () => {
  it('should return sorted (ascending) pattern params with value property', () => {
    const patternParams = { testParam: { signatureIndex: 0, patternIndex: 0, isRequired: false, isVarargs: false } }
    const actualParamsValues = ['I am a value of testParam']

    const results = mapActualValueToParams(patternParams, actualParamsValues)

    expect(results).toStrictEqual([{ ...patternParams.testParam, value: 'I am a value of testParam' }])
  })

  it('should return empty array when pattern params are falsy', () => {
    const results = mapActualValueToParams(null, ['Some value'])
    expect(results).toStrictEqual([])
  })

  it('shuld return joined (bonded) value for varargs pattern params', () => {
    const patternParams = { testParam: { signatureIndex: 0, patternIndex: 1, isRequired: false, isVarargs: true } }
    const actualParamsValues = ['thatParamShouldNotBeCounted', 'hello', 'there', 'my', 'little', 'friend']

    const results = mapActualValueToParams(patternParams, actualParamsValues)

    expect(results).toStrictEqual([{ ...patternParams.testParam, value: 'hello there my little friend' }])
  })

  it('should return null when normal pattern param does not have value', () => {
    const patternParams = { testParam: { signatureIndex: 0, patternIndex: 0, isRequired: false, isVarargs: false } }

    const results = mapActualValueToParams(patternParams, [])

    expect(results).toStrictEqual([{ ...patternParams.testParam, value: null }])
  })

  it('should return null when varargs pattern param does not have value', () => {
    const patternParams = { testParam: { signatureIndex: 0, patternIndex: 1, isRequired: false, isVarargs: true } }

    const results = mapActualValueToParams(patternParams, [])

    expect(results).toStrictEqual([{ ...patternParams.testParam, value: null }])
  })

  it(`should return empty array when both passed function's arguments are falsy`, () => {
    const results = mapActualValueToParams(null, null)
    expect(results).toStrictEqual([])
  })
})
