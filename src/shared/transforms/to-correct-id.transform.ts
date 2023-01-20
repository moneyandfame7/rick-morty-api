import * as _ from 'lodash'

export const toCorrectId = (id: string): number[] => (typeof id === 'string' ? _.compact(id.split(',').map(id => parseInt(id))) : id)
