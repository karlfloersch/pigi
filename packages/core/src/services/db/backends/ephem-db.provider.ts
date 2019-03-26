/* Internal Imports */
import { jsonify, stringify } from '../../../utils'
import { DBValue, DBObject, DBResult, BaseDBProvider } from './base-db.provider'

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
  public async get<T>(key: string, fallback?: T): Promise<T | DBResult> {
    const result = this.db.get(key)
    if (!result) {
      if (fallback !== undefined) {
        return fallback
      } else {
        throw new Error('Key not found in database')
      }
    }

    return jsonify(result)
  }

  /**
   * Sets a given key with the value.
   * @param key Key to set.
   * @param value Value to store.
   */
  public async put(key: string, value: DBValue): Promise<void> {
    const stringified = stringify(value)
    this.db.set(key, stringified)
  }

  /**
   * Deletes a given key from storage.
   * @param key Key to delete.
   */
  public async del(key: string): Promise<void> {
    this.db.delete(key)
  }

  /**
   * Checks if a key exists in storage.
   * @param key Key to check.
   * @returns `true` if the key exists, `false` otherwise.
   */
  public async exists(key: string): Promise<boolean> {
    return this.db.has(key)
  }

  /**
   * Finds the next key after a given key.
   * @param key The key to start searching from.
   * @returns the next key with the same prefix.
   */
  public async seek(key: string): Promise<string> {
    const prefix = key.split(':')[0]
    const keys = Array.from(this.db.keys())

    const nextKey = keys
      .filter((k) => {
        return k.startsWith(prefix)
      })
      .sort()
      .find((k) => {
        return k > key
      })

    if (!nextKey) {
      throw new Error('Could not find next key in database.')
    }

    return nextKey
  }

  /**
   * Puts a series of objects into the database in bulk.
   * Should be more efficient than simply calling `set` repeatedly.
   * @param objects A series of objects to put into the database.
   */
  public async batch(objects: DBObject[]): Promise<void> {
    for (const object of objects) {
      await this.put(object.key, object.value)
    }
  }

  /**
   * Pushes to an array stored at a key in the database.
   * @param key The key at which the array is stored.
   * @param value Value to add to the array.
   */
  public async push<T>(key: string, value: T | T[]): Promise<void> {
    const current = (await this.get(key, [])) as T[]
    value = Array.isArray(value) ? value : [value]
    current.concat(value)
    await this.put(key, current)
  }
}
