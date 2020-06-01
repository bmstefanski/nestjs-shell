export function removeProperty(object: any, property: string): any {
  const { [property]: bye, ...otherProps } = object
  return otherProps
}
