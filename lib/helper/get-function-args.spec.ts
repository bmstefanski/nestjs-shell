import { getFunctionArgs } from './get-function-args'

describe('getFunctionArgs', () => {
  it('should return function parameters', () => {
    const someFunction = (abc: string, def: number) => abc + def

    const results = getFunctionArgs(someFunction)

    expect(results).toStrictEqual(['abc', 'def'])
  })

  it(`should return function parameters from object's method`, () => {
    const someObjectWithMethod = { someFunction(abc: string, def: number): void {} }

    const results = getFunctionArgs(someObjectWithMethod.someFunction)

    expect(results).toStrictEqual(['abc', 'def'])
  })

  it('should return empty array when passed function with no parameters', () => {
    const someFunction = () => ''

    const results = getFunctionArgs(someFunction)

    expect(results).toStrictEqual([])
  })

  it('should throw an error when passed falsy value', () => {
    expect(() => getFunctionArgs(null)).toThrowError('Passed parameter is undefined or not a function')
  })
})
