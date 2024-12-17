export function intersection(arr1: Array<number>, arr2: Array<number>) {
  return arr1.filter((value) => arr2.includes(value))
}

export function symmetricDifference(arr1: Array<number>, arr2: Array<number>) {
  return [
    ...arr1.filter((value) => !arr2.includes(value)),
    ...arr2.filter((value) => !arr1.includes(value)),
  ]
}

export function unique(arr: Array<number>) {
  return [...new Set(arr)]
}

export function equal(arr1: Array<number>, arr2: Array<number>) {
  if (arr1.length !== arr2.length) return false

  return arr1.every((value, index) => value === arr2[index])
}

export function getAllCommonElements(arr1: Array<number>, arr2: Array<number>): Array<number> {
  const set1 = new Set(arr1)

  return arr2.filter((element: number) => set1.has(element))
}
