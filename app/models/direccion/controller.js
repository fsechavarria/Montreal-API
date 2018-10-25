import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Direcciones.
 * @param {integer} req.params.id - ID de la Direccion. (Opcional) 
 * @param {integer} req.query.id_ciudad - ID de la ciudad a la que pertenece. (Opcional)
 * @param {string} req.query.calle - Calle de la dirección. (Opcional)
 * @param {string} req.query.numeracion - Numeración de la dirección. (Opcional)
 * @param {string} req.query.departamento - Departamento de la dirección. (Opcional)
 * @returns {json} - Objeto con las direcciones encontradas.
 */
async function GET (req, res) {
	try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_direccion: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			id_ciudad: (typeof req.query.id_ciudad === 'undefined' || isNaN(req.query.id_ciudad) || String(req.query.id_ciudad).trim().length === 0) ? undefined : parseInt(req.query.id_ciudad),
      calle: (typeof req.query.calle !== 'string' || req.query.calle.trim().length === 0) ? undefined : req.query.calle.trim(),
      numeracion: (typeof req.query.numeracion === 'undefined' || String(req.query.numeracion).trim().length === 0) ? undefined : String(req.query.numeracion).trim(),
      departamento: (typeof req.query.departamento === 'undefined' || String(req.query.departamento).trim().length === 0) ? undefined : String(req.query.departamento).trim()
    }
    let result = []
		result = await database.executeGETProcedure('BEGIN SELECTdireccion(:cursor, :id_direccion, :id_ciudad, :calle, :numeracion, :departamento); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { direccion: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna dirección.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Dirección
 * @param {integer} req.body.ID_CIUDAD - ID de la ciudad a la que pertenece.
 * @param {string} req.body.CALLE - Calle de la dirección.
 * @param {string} req.body.NUMERACION - Numeración de la dirección.
 * @param {string} req.body.DEPARTAMENTO - Departamento de la dirección. (Opcional)
 * @returns {json} - Objeto con la dirección ingresada.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			id_ciudad: (typeof req.body.ID_CIUDAD === 'undefined' || isNaN(req.body.ID_CIUDAD) || String(req.body.ID_CIUDAD).trim().length === 0) ? undefined : parseInt(req.body.ID_CIUDAD),
      calle: (typeof req.body.CALLE !== 'string' || req.body.CALLE.trim().length === 0) ? undefined : req.body.CALLE.trim(),
      numeracion: (typeof req.body.NUMERACION === 'undefined' || String(req.body.NUMERACION).trim().length === 0) ? undefined : String(req.body.NUMERACION).trim(),
      departamento: (typeof req.body.DEPARTAMENTO === 'undefined' || String(req.body.DEPARTAMENTO).trim().length === 0) ? undefined : String(req.body.DEPARTAMENTO).trim()
    }
    if (bindvars.id_ciudad !== undefined && bindvars.calle !== undefined && bindvars.numeracion !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTdireccion(:cursor, :id_ciudad, :calle, :numeracion, :departamento); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { direccion: result[0] } })
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
 * Actualizar Dirección
 * @param {integer} req.params.id - ID de la Dirección.
 * @param {integer} req.body.ID_CIUDAD - ID de la ciudad a la que pertenece. (Opcional)
 * @param {string} req.body.CALLE - Calle de la dirección. (Opcional)
 * @param {string} req.body.NUMERACION - Numeración de la dirección. (Opcional)
 * @param {string} req.body.DEPARTAMENTO - Departamento de la dirección. (Opcional)
 * @returns {json} - Objeto con la dirección actualizada.
 */
async function PUT (req, res) {
  try {
		const id_direccion = (typeof req.params.id  === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_direccion != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_direccion: id_direccion,
        id_ciudad: (typeof req.body.ID_CIUDAD === 'undefined' || isNaN(req.body.ID_CIUDAD) || String(req.body.ID_CIUDAD).trim().length === 0) ? undefined : parseInt(req.body.ID_CIUDAD),
        calle: (typeof req.body.CALLE !== 'string' || req.body.CALLE.trim().length === 0) ? undefined : req.body.CALLE.trim(),
        numeracion: (typeof req.body.NUMERACION === 'undefined' || String(req.body.NUMERACION).trim().length === 0) ? undefined : String(req.body.NUMERACION).trim(),
        departamento: (typeof req.body.DEPARTAMENTO === 'undefined' || String(req.body.DEPARTAMENTO).trim().length === 0) ? '' : String(req.body.DEPARTAMENTO).trim()
      }
      let result = await database.executeProcedure('BEGIN UPDATEdireccion(:cursor, :id_direccion, :id_ciudad, :calle, :numeracion, :departamento); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Dirección Actualizada', direccion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna dirección' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna dirección' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Dirección
 * @param {integer} req.params.id - ID de la dirección.
 * @returns {json} - Objeto con la dirección eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_direccion = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_direccion != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_direccion: id_direccion }
      let result = await database.executeProcedure('BEGIN DELETEdireccion(:cursor, :id_direccion); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Dirección Eliminada', direccion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna dirección' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna dirección' } })
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
