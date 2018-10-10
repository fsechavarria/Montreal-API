import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener CELs
 * @param {integer} req.params.id - ID del CEL. (Opcional) 
 * @param {integer} req.query.id_usuario - ID del usuario al que pertenece el CEL. (Opcional)
 * @param {string} req.query.nom_centro - Nombre del CEL. (Opcional)
 * @returns {json} - Objeto con los CEL encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_cel: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			id_usuario: (typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) || String(req.query.id_usuario).trim().length === 0) ? undefined : parseInt(req.query.id_usuario),
			nom_centro: (typeof req.query.nom_centro !== 'string' || req.query.nom_centro.trim().length === 0) ? undefined : req.query.nom_centro.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTcel(:cursor, :id_cel, :id_usuario, :nom_centro); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { cel: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEL.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar CEL
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el CEL.
 * @param {string} req.body.NOM_CENTRO - Nombre del CEL.
 * @returns {json} - Objeto con el CEL ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : req.body.ID_USUARIO,
      nom_centro: (typeof req.body.NOM_CENTRO !== 'string' || req.body.NOM_CENTRO.trim().length === 0) ? undefined : req.body.NOM_CENTRO.trim()
		}
    if (bindvars.id_usuario !== undefined && bindvars.nom_centro !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTcel(:cursor, :id_usuario, :nom_centro); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { cel: result[0] } })
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
 * Actualizar CEL
 * @param {integer} req.params.id - ID del CEL
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el CEL. (Opcional)
 * @param {string} req.body.NOM_CENTRO - Nombre del CEL. (Opcional)
 * @returns {json} - Objeto con el CEL actualizado.
 */
async function PUT (req, res) {
  try {
		const id_cel = (typeof req.params.id  === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_cel != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_cel: id_cel,
        id_usuario: (typeof req.body.ID_USUARIO  === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
				nom_centro: (typeof req.body.NOM_CENTRO !== 'string' || req.body.NOM_CENTRO.trim().length === 0) ? undefined : req.body.NOM_CENTRO.trim()
			}
      let result = await database.executeProcedure('BEGIN UPDATEcel(:cursor, :id_cel, :id_usuario, :nom_centro); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'CEL Actualizado', cel: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEL' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEL' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar CEL
 * @param {integer} req.params.id - ID del CEL.
 * @returns {json} - Objeto el CEL eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_cel = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_cel != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_cel: id_cel }
      let result = await database.executeProcedure('BEGIN DELETEcel(:cursor, :id_cel); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'CEL Eliminado', cel: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEL' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEL' } })
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
