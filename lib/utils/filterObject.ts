export const filterObject = <T extends {}>(obj: T, keys: Array<keyof T>) => {
  const result: any = {}
  const uniqueKeys = Array.from(new Set(keys))
  Object.keys(obj)
    .filter((key) => !uniqueKeys.includes(key as keyof T))
    .forEach((key) => {
      result[key] = obj[key as keyof T]
    })
  return result
}
