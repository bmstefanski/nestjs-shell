import { parsePattern } from './pattern.parser'

describe('parsePattern', () => {
  it('should parse pattern which includes two required params', () => {
    const pattern = '<firstParam> <secondParam>'

    const results = parsePattern(pattern)

    expect(results).toStrictEqual({
      firstParam: { signatureIndex: 0, patternIndex: 0, isRequired: true, isVarargs: false },
      secondParam: { signatureIndex: 0, patternIndex: 1, isRequired: true, isVarargs: false },
    })
  })

  it('should parse pattern which includes one optional and one required param', () => {
    const pattern = '<firstParam> [secondParam]'

    const results = parsePattern(pattern)

    expect(results).toStrictEqual({
      firstParam: { signatureIndex: 0, patternIndex: 0, isRequired: true, isVarargs: false },
      secondParam: { signatureIndex: 0, patternIndex: 1, isRequired: false, isVarargs: false },
    })
  })

  it('should return empty object when passed falsy value (empty string)', () => {
    const results = parsePattern('')
    expect(results).toStrictEqual({})
  })

  it('should return empty object when passed pattern is invalid', () => {
    const pattern = '<retartedPattern:$@$@#%@> [normal]'

    const results = parsePattern(pattern)

    expect(results).toStrictEqual({})
  })

  it('should parse pattern with name made up of only letters and numbers and underscores', () => {
    const pattern = '<@ABCDEFGHIJKLMN_OPQRSTUVWXYZ> [@abcdefghijklmn_opqrstuvwxyz]'

    const results = parsePattern(pattern)

    expect(results).toStrictEqual({
      ABCDEFGHIJKLMN_OPQRSTUVWXYZ: { signatureIndex: 0, patternIndex: 0, isRequired: true, isVarargs: true },
      abcdefghijklmn_opqrstuvwxyz: { signatureIndex: 0, patternIndex: 1, isRequired: false, isVarargs: true },
    })
  })
})
