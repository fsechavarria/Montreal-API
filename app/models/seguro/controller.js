import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Seguros
 * @param {integer} req.params.id - ID del seguro. (Opcional) 
 * @param {string} req.query.desc_seguro - Descripción del seguro. (Opcional)
 * @param {boolean} req.query.vigente - Vigencia del seguro [true/false]. (Opcional)
 * @returns {json} - Objeto con los seguros encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
			id_seguro: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      desc_seguro: (typeof req.query.desc_seguro !== 'string' || req.query.desc_seguro.trim().length === 0) ? undefined : req.query.desc_seguro.trim(),
      vigente: (typeof req.query.vigente !== typeof true && typeof req.query.vigente !== 'string') ? undefined : String(req.query.vigente).trim().toLowerCase()
    }
    if (bindvars.vigente !== undefined && bindvars.vigente !== 'true' && bindvars.vigente !== 'false') {
      bindvars.vigente = undefined
    } else if (bindvars.vigente !== undefined) {
      bindvars.vigente = bindvars.vigente == 'true' ? 1 : 0
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTseguro(:cursor, :id_seguro, :desc_seguro, :vigente); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { seguro: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún seguro.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Seguro
 * @param {string} req.body.DESC_SEGURO - Descripción del seguro.
 * @param {boolean} req.body.VIGENTE - Vigencia del seguro [true/false]. (Opcional, por defecto True)
 * @returns {json} - Objeto con el seguro ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      desc_seguro: (typeof req.body.DESC_SEGURO !== 'string' || req.body.DESC_SEGURO.trim().length === 0) ? undefined : req.body.DESC_SEGURO.trim(),
      vigente: (typeof req.body.VIGENTE !== typeof true && typeof req.body.VIGENTE !== 'string') ? undefined : String(req.body.VIGENTE).trim().toLowerCase()
    }
    if (bindvars.vigente !== undefined && bindvars.vigente !== 'true' && bindvars.vigente !== 'false') {
      res.status(500).json({ error: true, data: { message: 'El valor de Vigente debe ser true o false' } })
      return
    }
    bindvars.vigente = bindvars.vigente == 'true' ? 1 : 0
    if (bindvars.desc_seguro !== undefined && bindvars.vigente !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTseguro(:cursor, :desc_seguro, :vigente); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { seguro: result[0] } })
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
 * Actualizar Seguro
 * @param {integer} req.params.id - ID del seguro.
 * @param {string} req.body.DESC_SEGURO - Descripción del seguro. (opcional)
 * @param {boolean} req.body.VIGENTE - Vigencia del seguro [true/false]. (Opcional)
 * @returns {json} - Objeto con el seguro actualizado.
 */
async function PUT (req, res) {
  try {
		const id_seguro = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_seguro != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_seguro: id_seguro,
        desc_seguro: (typeof req.body.DESC_SEGURO !== 'string' || req.body.DESC_SEGURO.trim().length === 0) ? undefined : req.body.DESC_SEGURO.trim(),
        vigente: (typeof req.body.VIGENTE !== typeof true && typeof req.body.VIGENTE !== 'string') ? undefined : String(req.body.VIGENTE).trim().toLowerCase()
      }
      if (bindvars.vigente !== undefined && bindvars.vigente !== 'true' && bindvars.vigente !== 'false') {
        res.status(500).json({ error: true, data: { message: 'El valor de Vigente debe ser true o false' } })
        return
      } else if (bindvars.vigente !== undefined) {
        bindvars.vigente = bindvars.vigente == 'true' ? 1 : 0
      }
      let result = await database.executeProcedure('BEGIN UPDATEseguro(:cursor, :id_seguro, :desc_seguro, :vigente); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Seguro Actualizado', seguro: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ningún seguro' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún seguro' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Seguro
 * @param {integer} req.params.id - ID del rol.
 * @returns {json} - Objeto con el seguro eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_seguro = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_seguro != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_seguro: id_seguro }
      let result = await database.executeProcedure('BEGIN DELETEseguro(:cursor, :id_seguro); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Seguro Eliminado', seguro: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún seguro' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún seguro' } })
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
