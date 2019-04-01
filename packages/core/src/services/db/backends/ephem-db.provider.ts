/* Internal Imports */
import { jsonify, stringify } from '../../../utils'
import {
  DBValue,
  DBObject,
  DBResult,
  DBIterator,
  BaseDBProvider,
} from './base-db.provider'

class EphemDBIterator implements DBIterator {
  constructor(public iterator: any) {}

  public next(): Promise<any> {
    return new Promise((resolve, reject) => {})
  }

  public end(): Promise<void> {
    return new Promise((resolve, reject) => {})
  }
}

export class EphemDBProvider implements BaseDBProvider {
  private db = new Map<string, string>()

  /**
   * Empty method since it's required.
   */
  public async start(): Promise<void> {
    return
  }

  /**
   * Returns the value stored at the given key.
   * @param key Key to query.
   * @param fallback A fallback value if the key doesn't exist.
   * @returns the stored value or the fallback.
   */
  public async get<T>(
    _key: Buffer | string
  ): Promise<DBValue> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Sets a given key with the value.
   * @param key Key to set.
   * @param value Value to store.
   */
  public async put(_key: Buffer | string, value: DBValue): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Deletes a given key from storage.
   * @param key Key to delete.
   */
  public async del(_key: Buffer | string): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Checks if a key exists in storage.
   * @param key Key to check.
   * @returns `true` if the key exists, `false` otherwise.
   */
  public async exists(_key: Buffer | string): Promise<boolean> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Creates a DB iterator based on the supplied options
   * @param options The key to start searching from.
   * @returns the DB iterator
   */
  public async iterator(options: object): Promise<DBIterator> {
    throw new Error('Method not implemented')
  }

  /**
   * Finds the next key after a given key.
   * @param key The key to start searching from.
   * @returns the next key with the same prefix.
   */
  public async seek(_key: Buffer | string): Promise<string> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Puts a series of objects into the database in bulk.
   * Should be more efficient than simply calling `set` repeatedly.
   * @param objects A series of objects to put into the database.
   */
  public async batch(objects: DBObject[]): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Pushes to an array stored at a key in the database.
   * @param key The key at which the array is stored.
   * @param value Value to add to the array.
   */
  public async push<T>(key: string, value: T | T[]): Promise<void> {
    throw Error('Not Implmeneted')
    return null
  }

  /**
   * Accepts a string or Buffer and returns a string representation of
   * the input.
   * @param value
   * @returns the value as a string
   */
  private convertToString(value: Buffer | string) {
    // if (typeof value === 'string') return value
    // else return value.toString()
  }
}
