import oracledb from 'oracledb'
import dbConfig from './config'

async function initialize () {
  const pool = await oracledb.createPool(dbConfig.dbPool)
}

const defaultThreadPoolSize = 4;
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.dbPool.poolMax + defaultThreadPoolSize;

async function startup () {
  try {
    console.log('Inicializando la base de datos...')
    await initialize()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function close () {
  console.log('Closing database connection...')
  await oracledb.getPool().close()
}

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn
 
    opts.outFormat = oracledb.OBJECT
    opts.autoCommit = true
 
    try {
      conn = await oracledb.getConnection()
 
      const result = await conn.execute(statement, binds, opts)
 
      resolve(result)
    } catch (err) {
      reject(err)
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close()
        } catch (err) {
          console.log(err)
        }
      }
    }
  })
}

module.exports = {
  startup,
  close,
  simpleExecute
}
