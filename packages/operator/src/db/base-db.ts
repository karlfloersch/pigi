export type DBValue = string | object | number | boolean | Buffer

export type DBResult = DBValue | DBValue[]

export interface DBObject {
  type: string
  key: Buffer
  value: DBValue
}

export interface BaseDB {
  get<T>(key: Buffer, fallback?: T): Promise<T | DBResult>
  set(key: Buffer, value: DBValue): Promise<void>
  delete(key: Buffer): Promise<void>
  exists(key: Buffer): Promise<boolean>
  seek(key: Buffer): Promise<Iterator<Buffer>>
  batch(objects: DBObject[]): Promise<void>
}
