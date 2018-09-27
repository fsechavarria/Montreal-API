import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Ciudades
 * @param {integer} req.params.id - ID de la Ciudad. (Opcional) 
 * @param {integer} req.query.id_pais - ID del País al que pertenece la ciudad. (Opcional)
 * @param {string} req.query.nombre - Nombre de la Ciudad. (Opcional)
 * @returns {json} - Objeto con las ciudades encontradas.
 */
async function GET (req, res) {
	try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_ciudad: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			id_pais: (typeof req.query.id_pais === 'undefined' || isNaN(req.query.id_pais) ) ? undefined : parseInt(req.query.id_pais),
			nombre: (typeof req.query.nombre !== 'string' || req.query.nombre.trim().length === 0) ? undefined : req.query.nombre
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTciudad(:cursor, :id_ciudad, :id_pais, :nombre); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { ciudad: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna ciudad.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Ciudad
 * @param {string} req.body.NOMBRE - Nombre de la ciudad
 * @param {integer} req.body.ID_PAIS - ID del pais al que pertenece la ciudad.
 * @returns {json} - Objeto con la ciudad ingresada.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_pais: (typeof req.body.ID_PAIS === 'undefined' || isNaN(req.body.ID_PAIS) ) ? undefined : req.body.ID_PAIS,
      nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE
		}
    if (bindvars.nombre !== undefined && bindvars.id_pais !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTciudad(:cursor, :id_pais, :nombre); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { ciudad: result[0] } })
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
 * Actualizar Ciudad
 * @param {integer} req.params.id - ID de la Ciudad.
 * @param {integer} req.body.ID_PAIS - ID del País al que pertenece la Ciudad. (Opcional)
 * @param {string} req.body.NOMBRE - Nombre de la Ciudad. (Opcional)
 * @returns {json} - Objeto con la Ciudad actualizada.
 */
async function PUT (req, res) {
  try {
		const id_ciudad = (typeof req.params.id  === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_ciudad != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_ciudad: id_ciudad,
        id_pais: (typeof req.body.ID_PAIS  === 'undefined' || isNaN(req.body.ID_PAIS) ) ? undefined : parseInt(req.body.ID_PAIS),
				nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE
			}
      let result = await database.executeProcedure('BEGIN UPDATEciudad(:cursor, :id_ciudad, :id_pais, :nombre); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Ciudad Actualizada', ciudad: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ninguna ciudad' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna ciudad' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Ciudad
 * @param {integer} req.params.id - ID de la Ciudad.
 * @returns {json} - Objeto con la ciudad eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_ciudad = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_ciudad != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_ciudad: id_ciudad }
      let result = await database.executeProcedure('BEGIN DELETEciudad(:cursor, :id_ciudad); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Ciudad Eliminada', ciudad: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ninguna ciudad' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna ciudad' } })
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
