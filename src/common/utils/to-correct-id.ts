import * as _ from 'lodash'

export const toCorrectId = (id: string): number[] => _.compact(id.split(',').map(id => parseInt(id)))
