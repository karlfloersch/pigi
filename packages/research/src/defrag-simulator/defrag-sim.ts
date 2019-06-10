/* External Imports */
import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
import BigNum = require('bn.js')

/* Logging Imports */
import debug from 'debug'
const log = debug('info:defrag-sim')

export function greedyDefrag(rangeDB: LevelRangeStore) {
  return rangeDB
}

export class DefragSim {
  public totalDeposits = new BigNum(0)
  public time = 0

  constructor(
    readonly db: LevelRangeStore,
    readonly numUsers: number,
    readonly randomSeed: string,
    readonly randomGenerators: {
      depositRangeLength: () => number,
      shouldDeposit: () => boolean,
      sendRangeLength: () => number,
      recipient: () => number,
    },
    readonly executeDefrag: any
  ) {
    log('Initializing')
    log(
      'Testing all of the random number gens:',
      'Num users:', this.numUsers,
      'depositRangeLength', randomGenerators.depositRangeLength(),
      'shouldDeposit', randomGenerators.shouldDeposit(),
      'sendRangeLength', randomGenerators.sendRangeLength(),
      'recipient', randomGenerators.recipient())
  }

  public async tick(numTimes): Promise<void> {
    for (let i = 0; i < numTimes; i++) {
      await this._tick()
    }
  }

  private async _tick(): Promise<void> {
    log('Tick number:', this.time)
    // For each user determine if we should deposit
    for (let user = 0; user < this.numUsers; user++) {
      if (this.randomGenerators.shouldDeposit()) {
        // Store the start
        const start = new BigNum(this.totalDeposits)
        // Increment total deposits
        this.totalDeposits = this.totalDeposits.addn(this.randomGenerators.depositRangeLength())
        // Now add the deposit
        this.db.put(start, this.totalDeposits, Buffer.from(new BigNum(user).toString('hex')))
      }
    }
    // increment time
    this.time++
  }
}

export const test = 10
