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
  public numDeposits: number = 0
  public userType: string = 'online'

  constructor(
    readonly depositRangeLength: () => number,
    readonly sendRangeLength: () => number,
    readonly recipient: () => number
  ) {}

  private shouldDeposit(): boolean {
    return this.numDeposits === 0
  }

  public async tick(): Promise<void> {
    // If the user wants to, deposit
    if (this.shouldDeposit()) {
      log('User', this.id, 'depositing')
      this.numDeposits++
      await this.sim.deposit(this, this.depositRangeLength())
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
      await user.tick()
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
    await this.db.put(start, this.totalDeposits, this.userToValue(user.id))
  }

  public async getRanges(): Promise<any[]> {
    const res = await this.db.get(new BigNum(0), new BigNum(9999999999))
    const ranges = []
    for(const bnRange of res) {
      const range = {
        start: '0x' + bnRange.start.toString('hex'),
        end: '0x' + bnRange.end.toString('hex'),
        value: '0x' + bnRange.value.toString('hex'),
      }
      ranges.push(range)
    }
    return ranges
  }

  public async getNumFragments(): Promise<{}> {
    const res = await this.db.get(new BigNum(0), new BigNum(9999999999))
    const ranges = []
    let lastOwner
    let numFragments = 0
    const fragmentsByUserType = {}
    for(const bnRange of res) {
      const user = this.userFromValue(bnRange.value)
      if (lastOwner !== bnRange.value) {
        // Increment the number of fragments
        numFragments++
        // Increment the number of fragments for this user type
        fragmentsByUserType[user.userType] = (fragmentsByUserType[user.userType] === undefined) ? 1 : fragmentsByUserType[user.userType] + 1
        // Set the last owner to be the owner of this range
        lastOwner = bnRange.value
      }
    }
    return {
      numFragments,
      fragmentsByUserType
    }
  }

  private userFromValue(userId: Buffer): User {
    const id = new BigNum(userId).toNumber()
    return this.users[id]
  }

  private userToValue(userId: number): Buffer {
    const bufId = new BigNum(userId).toBuffer('be')
    return bufId
  }
}
