import path = require('path')
const rootPath = __dirname
const dbRootPath = path.join(__dirname, 'db')

export { rootPath, dbRootPath }
export { LevelRangeStore } from './src/app/db/range-db'
export { RangeEntry } from './src/interfaces/db/range-db.interface'
