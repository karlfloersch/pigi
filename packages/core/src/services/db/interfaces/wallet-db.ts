/* External Imports */
import { Service, OnStart } from '@nestd/core'
import { account as Account } from 'eth-lib'

/* Services */
import { DBService } from '../db.service'

/* Internal Imports */
import { EthereumAccount } from '../../../models/eth'
import { BaseDBProvider } from '../backends/base-db.provider'

/**
 * Service that exposes an interface to wallet-related
 * database calls.
 */
@Service()
export class WalletDB implements OnStart {
  constructor(private readonly dbservice: DBService) {}

  /**
   * @returns the current DB instance.
   */
  public get db(): BaseDBProvider {
    const db = this.dbservice.dbs.wallet
    if (db === undefined) {
      throw new Error('WalletDB is not yet initialized.')
    }
    return db
  }

  public async onStart(): Promise<void> {
    await this.dbservice.open({ namespace: 'wallet' })
  }

  /**
   * Returns all available accounts.
   * @returns a list of account addresses.
   */
  public async getAccounts(): Promise<string[]> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Returns an account object for a given address.
   * @param address Adress of the account.
   * @returns an Ethereum account object.
   */
  public async getAccount(address: string): Promise<EthereumAccount> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Adds an account to the database.
   * @param account An Ethereum account object.
   */
  public async addAccount(account: EthereumAccount): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }
}
