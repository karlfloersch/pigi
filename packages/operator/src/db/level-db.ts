/* External Imports */
import levelup from 'levelup'
import leveldown from 'leveldown'

/* Internal Imports */
import { DBValue, DBObject, DBResult, BaseDB } from './base-db'

export class LevelDB implements BaseDB {
  private db

  /**
   * Constructs a new levelDB instance using the desired path
   */
  constructor(path: string) {
    this.db = levelup(leveldown(path))
  }

  /**
   * Returns the value stored at the given key.
   * @param key Key to query.
   * @param fallback A fallback value if the key doesn't exist.
   * @returns the stored value or the fallback.
   */
  public async get<T>(key: Buffer, fallback?: T): Promise<T | DBResult> {
    const result = await this.db.get(key)
    if (!result) {
      if (fallback !== undefined) {
        return fallback
      } else {
        throw new Error('Key not found in database')
      }
    }
    return result
  }

  /**
   * Sets a given key with the value.
   * @param key Key to set.
   * @param value Value to store.
   */
  public async set(key: Buffer, value: Buffer): Promise<void> {
    await this.db.set(key, value)
  }

  /**
   * Deletes a given key from storage.
   * @param key Key to delete.
   */
  public async delete(key: Buffer): Promise<void> {
    await this.db.del(key)
  }

  /**
   * Checks if a key exists in storage.
   * @param key Key to check.
   * @returns `true` if the key exists, `false` otherwise.
   */
  public async exists(key: Buffer): Promise<boolean> {
    try {
      await this.db.get(key)
      return false
    } catch (err) {
      return true
    }
  }

  /**
   * Finds the next key after a given key.
   * @param key The key to start searching from.
   * @returns the next key with the same prefix.
   */
  public async seek(key: Buffer): Promise<Iterator<Buffer>> {
    const result = await this.db.seek(key)
    return result
  }

  /**
   * Puts a series of objects into the database in bulk.
   * Should be more efficient than simply calling `set` repeatedly.
   * @param objects A series of objects to put into the database.
   */
  public async batch(operations: DBObject[]): Promise<void> {
    await this.db.batch(operations)
  }
}
