import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener CEMs
 * @param {integer} req.params.id - ID del CEM. (Opcional) 
 * @param {integer} req.query.id_usuario - ID del usuario al que pertenece el CEM. (Opcional)
 * @param {string} req.query.nom_centro - Nombre del CEM. (Opcional)
 * @returns {json} - Objeto con los CEM encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_cem: (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
			id_usuario: (req.query.id_usuario === null || typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) || String(req.query.id_usuario).trim().length === 0) ? undefined : parseInt(req.query.id_usuario),
			nom_centro: (req.query.nom_centro === null || typeof req.query.nom_centro !== 'string' || req.query.nom_centro.trim().length === 0) ? undefined : req.query.nom_centro.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTcem(:cursor, :id_cem, :id_usuario, :nom_centro); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { cem: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEM.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar CEM
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el CEM.
 * @param {string} req.body.NOM_CENTRO - Nombre del CEM.
 * @returns {json} - Objeto con el CEM ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: (req.body.ID_USUARIO === null || typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : req.body.ID_USUARIO,
      nom_centro: (req.body.NOM_CENTRO === null || typeof req.body.NOM_CENTRO !== 'string' || req.body.NOM_CENTRO.trim().length === 0) ? undefined : req.body.NOM_CENTRO.trim()
		}
    if (bindvars.id_usuario !== undefined && bindvars.nom_centro !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTcem(:cursor, :id_usuario, :nom_centro); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { cem: result[0] } })
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
 * Actualizar CEM
 * @param {integer} req.params.id - ID del CEM.
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el CEM. (Opcional)
 * @param {string} req.body.NOM_CENTRO - Nombre del CEM. (Opcional)
 * @returns {json} - Objeto con el CEM actualizado.
 */
async function PUT (req, res) {
  try {
		const id_cem = (req.params.id === null || typeof req.params.id  === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_cem != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_cem: id_cem,
        id_usuario: (req.body.ID_USUARIO === null || typeof req.body.ID_USUARIO  === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
				nom_centro: (req.body.NOM_CENTRO === null || typeof req.body.NOM_CENTRO !== 'string' || req.body.NOM_CENTRO.trim().length === 0) ? undefined : req.body.NOM_CENTRO.trim()
			}
      let result = await database.executeProcedure('BEGIN UPDATEcem(:cursor, :id_cem, :id_usuario, :nom_centro); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'CEM Actualizado', cem: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEM' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEM' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar CEM
 * @param {integer} req.params.id - ID del CEM.
 * @returns {json} - Objeto el CEM eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_cem = (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_cem != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_cem: id_cem }
      let result = await database.executeProcedure('BEGIN DELETEcem(:cursor, :id_cem); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'CEM Eliminado', cem: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEM' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún CEM' } })
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
