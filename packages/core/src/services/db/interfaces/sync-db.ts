/* External Imports */
import { Service, OnStart } from '@nestd/core'
import { Transaction } from '@pigi/utils'

/* Services */
import { BaseDBProvider } from '../backends/base-db.provider'
import { DBService } from '../db.service'

/* Internal Imports */
import { EthereumEvent } from '../../../models/eth'
import { ContractService } from '../../eth/contract.service'

/**
 * Service that exposes an interface to sync-related
 * database calls.
 */
@Service()
export class SyncDB implements OnStart {
  constructor(
    private readonly contract: ContractService,
    private readonly dbservice: DBService
  ) {}

  /**
   * @returns the current db instance.
   */
  get db(): BaseDBProvider {
    const db = this.dbservice.dbs.sync
    if (db === undefined) {
      throw new Error('SyncDB is not yet initialized.')
    }
    return db
  }

  public async onStart(): Promise<void> {
    const address = await this.contract.waitForAddress()
    await this.dbservice.open({ namespace: 'sync', id: address })
  }

  /**
   * Returns the last synced block for a given event.
   * @param event Name of the event.
   * @returns Last synced block number.
   */
  public async getLastLoggedBlock(event: string): Promise<number> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Sets the last synced block for a given event.
   * @param event Name of the event.
   * @param block Last synced block number.
   */
  public async setLastLoggedBlock(event: string, block: number): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Checks whether an event has been seen.
   * @param event Hash of the event.
   * @returns `true` if the event has been seen, `false` otherwise.
   */
  public async getEventSeen(event: string): Promise<boolean> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Marks an event as seen.
   * @param event Hash of the event.
   */
  public async setEventSeen(event: string): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Returns the last synced block.
   * @returns Last synced block number.
   */
  public async getLastSyncedBlock(): Promise<number> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Sets the last synced block number.
   * @param block Block number to set.
   */
  public async setLastSyncedBlock(block: number): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Returns transactions that failed to sync.
   * @returns An array of encoded transactions.
   */
  public async getFailedTransactions(): Promise<Transaction[]> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Sets the failed transactions.
   * @param transactions An array of encoded transactions.
   */
  public async setFailedTransactions(transactions: string[]): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Marks a set of Ethereum events as seen.
   * @param events Ethereum events.
   */
  public async addEvents(events: EthereumEvent[]): Promise<void> {
    const objects = events.map((event) => {
      return { type: 'put', key: `event:${event.hash}`, value: true }
    })
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Checks if we've seen a specific event
   * @param event An Ethereum event.
   * @returns `true` if we've seen the event, `false` otherwise.
   */
  public async hasEvent(event: EthereumEvent): Promise<boolean> {
    return this.db.exists(`event:${event.hash}`)
  }
}
