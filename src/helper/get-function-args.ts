export function getFunctionArgs(func: Function): any[] {
  if (func && func.toString()) {
    const functionSignatureInString = func.toString()

    const openingBracetIndex = functionSignatureInString.indexOf('(')
    const closingBracetIndex = functionSignatureInString.indexOf(')')

    return functionSignatureInString
      .substring(openingBracetIndex + 1, closingBracetIndex)
      .split(',')
      .map((arg) => arg.trim())
  }

  throw new Error('Passed parameter is undefined or not a function/method')
}
