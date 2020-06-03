export function removeProperty(object: any, property: string): any {
  if (!object || !property) {
    throw new Error('Specified object or property is falsy')
  }

  const { [property]: bye, ...otherProps } = object
  return otherProps
}
