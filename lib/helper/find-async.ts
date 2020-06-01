export async function findAsync<T>(array: T[], asyncPredicate: (item: T) => Promise<boolean>): Promise<T> {
  const promises = array.map(asyncPredicate)
  const results = await Promise.all(promises)
  const index = results.findIndex((result) => result)
  return array[index]
}
