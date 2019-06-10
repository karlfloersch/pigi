import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
import { RandomNumberGenerationSource } from 'd3-random'

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
      depositRangeLength: RandomNumberGenerationSource,
      depositRecurrence: RandomNumberGenerationSource,
      sendRangeLength: RandomNumberGenerationSource,
      recipient: RandomNumberGenerationSource,
    },
    readonly executeDefrag: any
  ) {
    log('Initializing')
  }
}

export const test = 10
