import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Roles
 * @param {integer} req.params.id - ID del rol. (Opcional) 
 * @param {string} req.query.desc_rol - Descripción del rol. (Opcional)
 * @returns {json} - Objeto con los roles encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			id_rol: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			desc_rol: (typeof req.query.desc_rol !== 'string' || req.query.desc_rol.trim().length === 0) ? undefined : req.query.desc_rol.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTrol(:cursor, :id_rol, :desc_rol); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { rol: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún rol.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Rol
 * @param {string} req.body.DESC_ROL - Descripción del rol.
 * @returns {json} - Objeto con el rol ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			desc_rol: (typeof req.body.DESC_ROL !== 'string' || req.body.DESC_ROL.trim().length === 0) ? undefined : req.body.DESC_ROL.trim()
		}
    if (bindvars.desc_rol !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTrol(:cursor, :desc_rol); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { rol: result[0] } })
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
 * Actualizar Rol
 * @param {integer} req.params.id - ID del rol.
 * @param {string} req.body.DESC_ROL - Descripción del rol (Opcional)
 * @returns {json} - Objeto con el rol actualizado.
 */
async function PUT (req, res) {
  try {
		const id_rol = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_rol != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
				id_rol: id_rol,
				desc_rol: (typeof req.body.DESC_ROL !== 'string' || req.body.DESC_ROL.trim().length === 0) ? undefined : req.body.DESC_ROL.trim()
			}
      let result = await database.executeProcedure('BEGIN UPDATErol(:cursor, :id_rol, :desc_rol); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Rol Actualizado', rol: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ningún rol' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún rol' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Rol
 * @param {integer} req.params.id - ID del rol.
 * @returns {json} - Objeto con el rol eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_rol = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_rol != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_rol: id_rol }
      let result = await database.executeProcedure('BEGIN DELETErol(:cursor, :id_rol); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Rol Eliminado', rol: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún rol' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún rol' } })
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
