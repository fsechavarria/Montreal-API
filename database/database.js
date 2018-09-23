import oracledb from 'oracledb'
import dbConfig from './config'
import { fetchAsync, convert } from './_helpers'

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

/**
 * Metodo para ejecutar sentencias SQL.
 * @param {string} statement - Sentencia SQL a ejecutar.
 * @param {object} binds - Parametros para la sentencia SQL (opcional)
 * @param {object} opts - Opciones para la ejecución de la sentencia SQL(opcional, por defecto auto commit = true)
 */
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

/**
 * Metodo para ejecutar procedimientos almacenados que poseen un SELECT
 * @param {string} statement - Sentencia SQL para ejecutar el procedimiento
 * @param {object} binds - Parametros del procedimiento
 * @param {int} numRows - Cantidad de columnas por resultado (opcional, por defecto 10)
 * @returns {array} - Arreglo con el resultado del procedimiento.
 */
async function executeGETProcedure (statement, binds = {}, numRows = 10) {
  return new Promise(async (resolve, reject) => {
    let connection

    try {
      connection = await oracledb.getConnection()
      
      await connection.execute(statement, binds, async function (err, result) {
        if (err) {
          await connection.close()
          reject(err.message)
          return
        }
        var metaData = result.outBinds.cursor.metaData
        var resultSet = result.outBinds.cursor
        let resultData = []
        try {
          resultData = await fetchAsync(connection, resultSet, numRows, [])
          resultData = convert(metaData, resultData)
        } catch (err) {
          reject(err)
          return
        }
        resolve(resultData)
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Metodo para ejecutar procedimientos almacenados sin SELECT (Update, Delete, Insert)
 * @param {string} statement - Sentencia SQL para ejecutar el procedimiento
 * @param {object} binds - Parametros del procedimiento
 * @returns {int} - ID del objeto insertado
 */
async function executeProcedure (statement, binds = {}) {
  return new Promise(async (resolve, reject) => {
    let connection

    try {
      connection = await oracledb.getConnection()
      
      await connection.execute(statement, binds, async function (err, result) {
        if (err) {
          await connection.close()
          reject(err.message)
          return
        }
        await connection.close()
        resolve(result.outBinds)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  startup,
  close,
  simpleExecute,
  executeGETProcedure,
  executeProcedure
}
