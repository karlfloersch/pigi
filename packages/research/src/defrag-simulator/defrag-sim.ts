/* External Imports */
import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
import BigNum = require('bn.js')

/* Logging Imports */
import debug from 'debug'
const log = debug('info:defrag-sim')

export function greedyDefrag(rangeDB: LevelRangeStore) {
  return rangeDB
}

export class User {
  public id: number
  public sim: DefragSim

  constructor(
    readonly depositRangeLength: () => number,
    readonly shouldDeposit: () => boolean,
    readonly sendRangeLength: () => number,
    readonly recipient: () => number
  ) {}

  public async tick(): Promise<void> {
    // If the user wants to, deposit
    if (this.shouldDeposit()) {
      log('User', this.id, 'depositing')
      this.sim.deposit(this, this.depositRangeLength())
    }
  }
}

export class DefragSim {
  public totalDeposits = new BigNum(0)
  public users: User[] = []
  public time = 0

  constructor(
    readonly db: LevelRangeStore,
    readonly executeDefrag: any
  ) {
    log('Initializing defrag simulator.')
  }

  public registerUser(user: User): void {
    user.sim = this
    user.id = this.users.length
    this.users.push(user)
  }

  public async tick(numTimes): Promise<void> {
    for (let i = 0; i < numTimes; i++) {
      await this._tick()
    }
  }

  private async _tick(): Promise<void> {
    log('Tick number:', this.time)
    // For each user determine if we should deposit
    for (const user of this.users) {
      user.tick()
    }
    // increment time
    this.time++
  }

  public async deposit(user: User, amount: number): Promise<void> {
    // Store the start
    const start = new BigNum(this.totalDeposits)
    // Increment total deposits
    this.totalDeposits = this.totalDeposits.addn(amount)
    // Now add the deposit
    this.db.put(start, this.totalDeposits, Buffer.from(new BigNum(user.id).toString('hex')))
  }
}
