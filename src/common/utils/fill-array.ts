export const fillArray = (count: number): number[] => {
  let i = 0
  const a = Array(count)

  while (i < count) a[i++] = i

  return a
}
