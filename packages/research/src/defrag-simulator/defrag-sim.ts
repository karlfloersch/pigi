import { LevelRangeStore, RangeEntry  } from '@pigi/operator'

/* Logging Imports */
import debug from 'debug'
const log = debug('info:defrag-sim')

export function greedyDefrag(rangeDB: LevelRangeStore) {
  return rangeDB
}

export class DefragSim {
  constructor(
    readonly db: LevelRangeStore,
    readonly randomSeed: string,
    readonly randomGenerators: {
      numUsers: () => number,
      depositRangeLength: () => number,
      depositRecurrence: () => number,
      sendRangeLength: () => number,
      recipient: () => number,
    },
    readonly executeDefrag: any
  ) {
    log('Initializing')
    log(
      'Testing all of the random number gens:',
      'Num users:', randomGenerators.numUsers(),
      'depositRangeLength', randomGenerators.depositRangeLength(),
      'depositRecurrence', randomGenerators.depositRecurrence(),
      'sendRangeLength', randomGenerators.sendRangeLength(),
      'recipient', randomGenerators.recipient())
  }
}

export const test = 10
