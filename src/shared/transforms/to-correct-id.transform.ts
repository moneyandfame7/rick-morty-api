export function toCorrectId(id: string): number[] {
  return typeof id === 'string' ? id.split(',').map(id => parseInt(id)) : id
}
