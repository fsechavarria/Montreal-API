import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Familias
 * @param {integer} req.params.id - ID de la familia. (Opcional)
 * @param {integer} req.query.id_usuario - ID del usuario al que pertenece la familia. (Opcional)
 * @param {integer} req.query.num_integrantes - Descripción del rol. (Opcional)
 * @param {char} req.query.estado - Estado de la familia (Activa/Inactiva). (Opcional)
 * @returns {json} - Objeto con las familias encontradas.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_familia: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_usuario: (typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) || String(req.query.id_usuario).trim().length === 0) ? undefined : parseInt(req.query.id_usuario),
      num_integrantes: (typeof req.query.num_integrantes === 'undefined' || isNaN(req.query.num_integrantes) || String(req.query.num_integrantes).trim().length === 0) ? undefined : parseInt(req.query.num_integrantes),
      estado: (typeof req.query.estado !== 'string' || req.query.estado.trim().length === 0) ? undefined : req.query.estado.trim().toUpperCase()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTfamilia(:cursor, :id_familia, :id_usuario, :num_integrantes, :estado); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { familia: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna familia.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Familia
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece la familia.
 * @param {integer} req.body.NUM_INTEGRANTES - Numero de integrantes de la familia.
 * @param {char} req.body.ESTADO - Estado de la familia (Activa/Inactiva). (Opcional, por defecto Activa)
 * @returns {json} - Objeto con la familia ingresada.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
      num_integrantes: (typeof req.body.NUM_INTEGRANTES === 'undefined' || isNaN(req.body.NUM_INTEGRANTES) || String(req.body.NUM_INTEGRANTES).trim().length === 0) ? undefined : parseInt(req.body.NUM_INTEGRANTES),
      estado: (typeof req.body.ESTADO !== 'string' || req.body.ESTADO.trim().length === 0) ? 'A' : req.body.ESTADO.trim().toUpperCase()
    }
    if (bindvars.estado !== 'A' && bindvars.estado !== 'I') {
      res.status(400).json({ error: true, data: { message: 'El estado debe ser Activo[A] o Inactivo[I]' } })
      return
    }
    if (bindvars.estado !== undefined && bindvars.id_usuario !== undefined && bindvars.num_integrantes !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTfamilia(:cursor, :id_usuario, :num_integrantes, :estado); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { familia: result[0] } })
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
 * Actualizar Familia
 * @param {integer} req.params.id - ID de la familia.
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece la familia. (Opcional)
 * @param {integer} req.body.NUM_INTEGRANTES - Numero de integrantes de la familia. (Opcional)
 * @param {char} req.body.ESTADO - Estado de la familia. (Opcional)
 * @returns {json} - Objeto con la familia ingresada.
 */
async function PUT (req, res) {
  try {
		const id_familia = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_familia != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
				id_familia: id_familia,
				id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
        num_integrantes: (typeof req.body.NUM_INTEGRANTES === 'undefined' || isNaN(req.body.NUM_INTEGRANTES) || String(req.body.NUM_INTEGRANTES).trim().length === 0) ? undefined : parseInt(req.body.NUM_INTEGRANTES),
        estado: (typeof req.body.ESTADO !== 'string' || req.body.ESTADO.trim().length === 0) ? undefined : req.body.ESTADO.trim().toUpperCase()
      }
      if (bindvars.estado !== undefined && bindvars.estado !== 'A' && bindvars.estado !== 'I') {
        res.status(400).json({ error: true, data: { message: 'El estado debe ser Activo[A] o Inactivo[I]' } })
        return
      }
      let result = await database.executeProcedure('BEGIN UPDATEfamilia(:cursor, :id_familia, :id_usuario, :num_integrantes, :estado); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Familia Actualizada', familia: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ninguna familia' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna familia' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar familia
 * @param {integer} req.params.id - ID de la familia.
 * @returns {json} - Objeto con la familia eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_familia = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_familia != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_familia: id_familia }
      let result = await database.executeProcedure('BEGIN DELETEfamilia(:cursor, :id_familia); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Familia Eliminada', familia: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ninguna familia' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna familia' } })
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
