import { deepClone } from './deep-clone'

describe('deepClone', () => {
  it('should deep clone object with nested properties', () => {
    const value = { somePrimitive: 'hello', someObject: { someNestedPrimitive: 1337 } }

    const results = deepClone(value)

    expect(value).not.toBe(results)
  })

  it('should throw an error when passed value has type of function', () => {
    const value = () => '123'
    expect(() => deepClone(value)).toThrowError('Cannot deep clone a function')
  })

  it('should thorw an error when passed falsy value', () => {
    expect(() => deepClone(null)).toThrowError('Cannot deep clone a function')
  })
})
