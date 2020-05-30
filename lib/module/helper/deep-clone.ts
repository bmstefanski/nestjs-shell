export function deepClone(value: any): any {
  const valueType = typeof value
  if (valueType === 'function') {
    throw new Error('Cannot deep clone a function')
  }

  return JSON.parse(JSON.stringify(value))
}
