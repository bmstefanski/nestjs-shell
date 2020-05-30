export type SinglePatternParameter = {
  signatureIndex: number
  patternIndex: number
  isRequired: boolean
  isVarargs: boolean
}

export type SinglePatternParameterWithValue = SinglePatternParameter & { value: string }

export type PatternParameters = { [name: string]: SinglePatternParameter }
