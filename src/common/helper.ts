export function toCorrectId(id: string): number[] {
  // return id.split(',').map(id => parseInt(id))
  return typeof id === 'string' ? id.split(',').map(id => parseInt(id)) : id
}
