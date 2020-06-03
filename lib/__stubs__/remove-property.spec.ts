import { removeProperty } from './remove-property'

describe('removeProperty', () => {
  it('should remove property from object', () => {
    const someObject = { a: 1, b: 2 }

    const results = removeProperty(someObject, 'b')

    expect(results).toStrictEqual({ a: 1 })
  })

  it('should throw an error when passed object is falsy', () => {
    expect(() => removeProperty(null, 'a')).toThrowError('Specified object or property is falsy')
  })

  it('should throw an error when passed property (to remove) is falsy', () => {
    const someObject = { a: 1, b: 2 }
    expect(() => removeProperty(someObject, null)).toThrowError('Specified object or property is falsy')
  })
})
