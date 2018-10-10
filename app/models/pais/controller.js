import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Paises
 * @param {integer} req.params.id - ID del país. (Opcional) 
 * @param {string} req.query.nombre - Nombre del País (Opcional)
 * @returns {json} - Objeto con los paises encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			id_pais: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			nombre: (typeof req.query.nombre !== 'string' || req.query.nombre.trim().length === 0) ? undefined : req.query.nombre.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTpais(:cursor, :id_pais, :nombre); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { pais: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún país.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar País
 * @param {string} req.body.NOMBRE - Nombre del País
 * @returns {json} - Objeto con el país ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim()
		}
    if (bindvars.nombre !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTpais(:cursor, :nombre); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { pais: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'Error Interno' } })
      }
    } else {
      res.status(400).json({ error: true, data: { message: 'Parámetros Inválidos' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Actualizar País
 * @param {integer} req.params.id - ID del país.
 * @param {string} req.body.NOMBRE - Nombre del país (Opcional)
 * @returns {json} - Objeto con el País actualizado.
 */
async function PUT (req, res) {
  try {
		const id_pais = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_pais != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
				id_pais: id_pais,
				nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim()
			}
      let result = await database.executeProcedure('BEGIN UPDATEpais(:cursor, :id_pais, :nombre); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'País Actualizado', pais: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún país' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún país' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar País
 * @param {integer} req.params.id - ID del país.
 * @returns {json} - Objeto con el país eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_contacto = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_contacto != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_contacto: id_contacto }
      let result = await database.executeProcedure('BEGIN DELETEpais(:cursor, :id_contacto); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'País Eliminado', pais: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún país' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún país' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

module.exports = {
	GET,
	POST,
	PUT,
	DELETE
}
