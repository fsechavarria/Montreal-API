import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Antecedentes
 * @param {integer} req.params.id - ID del antecedente. (Opcional)
 * @param {integer} req.query.id_familia - ID de la familia asociada al antecedente. (Opcional)
 * @param {integer} req.query.url_antecedente - URL del antecedente (Ruta en el fichero). (Opcional)
 * @param {string} req.query.desc_antecedente - Descripción del antecedente. (Opcional)
 * @returns {json} - Objeto con los antecedentes encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_antecedente: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_familia: (typeof req.query.id_familia === 'undefined' || isNaN(req.query.id_familia) || String(req.query.id_familia).trim().length === 0) ? undefined : parseInt(req.query.id_familia),
      url_antecedente: (typeof req.query.url_antecedente !== 'string' || req.query.url_antecedente.trim().length === 0) ? undefined : req.query.url_antecedente.trim(),
      desc_antecedente: (typeof req.query.desc_antecedente !== 'string' || req.query.desc_antecedente.trim().length === 0) ? undefined : req.query.desc_antecedente.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTantecedente(:cursor, :id_antecedente, :id_familia, :url_antecedente, :desc_antecedente); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { antecedente: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún antecedente.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Antecedente
 * @param {integer} req.body.ID_FAMILIA - ID de la familia asociada al antecedente.
 * @param {integer} req.body.URL_ANTECEDENTE - URL del antecedente (Ruta en el fichero).
 * @param {string} req.body.DESC_ANTECEDENTE - Descripción del antecedente.
 * @returns {json} - Objeto con el antecedente ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_familia: (typeof req.body.ID_FAMILIA === 'undefined' || isNaN(req.body.ID_FAMILIA) || String(req.body.ID_FAMILIA).trim().length === 0) ? undefined : parseInt(req.body.ID_FAMILIA),
      url_antecedente: (typeof req.body.URL_ANTECEDENTE !== 'string' || req.body.URL_ANTECEDENTE.trim().length === 0) ? undefined : req.body.URL_ANTECEDENTE.trim(),
      desc_antecedente: (typeof req.body.DESC_ANTECEDENTE !== 'string' || req.body.DESC_ANTECEDENTE.trim().length === 0) ? undefined : req.body.DESC_ANTECEDENTE.trim()
		}
    if (bindvars.id_familia !== undefined && bindvars.url_antecedente !== undefined && bindvars.desc_antecedente !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTantecedente(:cursor, :id_familia, :url_antecedente, :desc_antecedente); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { antecedente: result[0] } })
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
 * Actualizar Antecedente
 * @param {integer} req.params.id - ID del antecedente.
 * @param {integer} req.body.ID_FAMILIA - ID de la familia asociada al antecedente. (Opcional)
 * @param {integer} req.body.URL_ANTECEDENTE - URL del antecedente (Ruta en el fichero). (Opcional)
 * @param {string} req.body.DESC_ANTECEDENTE - Descripción del antecedente. (Opcional)
 * @returns {json} - Objeto con el antecedente ingresado.
 */
async function PUT (req, res) {
  try {
		const id_antecedente = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_antecedente != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_antecedente: id_antecedente,
        id_familia: (typeof req.body.ID_FAMILIA === 'undefined' || isNaN(req.body.ID_FAMILIA) || String(req.body.ID_FAMILIA).trim().length === 0) ? undefined : parseInt(req.body.ID_FAMILIA),
        url_antecedente: (typeof req.body.URL_ANTECEDENTE !== 'string' || req.body.URL_ANTECEDENTE.trim().length === 0) ? undefined : req.body.URL_ANTECEDENTE.trim(),
        desc_antecedente: (typeof req.body.DESC_ANTECEDENTE !== 'string' || req.body.DESC_ANTECEDENTE.trim().length === 0) ? undefined : req.body.DESC_ANTECEDENTE.trim()
      }
      let result = await database.executeProcedure('BEGIN UPDATEantecedente(:cursor, :id_antecedente, :id_familia, :url_antecedente, :desc_antecedente); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Antecedente Actualizado', antecedente: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún antecedente' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún antecedente' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Antecedente
 * @param {integer} req.params.id - ID del antecedente.
 * @returns {json} - Objeto con el antecedente eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_antecedente = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_antecedente != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_antecedente: id_antecedente }
      let result = await database.executeProcedure('BEGIN DELETEantecedente(:cursor, :id_antecedente); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Antecedente Eliminado', antecedente: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún antecedente' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún antecedente' } })
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
