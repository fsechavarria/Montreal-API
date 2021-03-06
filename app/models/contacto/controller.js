import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Contactos
 * @param {integer} req.params.id - ID del contacto. (Opcional)
 * @param {integer} req.query.id_persona - ID de la persona a la que pertenece el contacto. (Opcional)
 * @param {string} req.query.desc_contacto - Descripción del contacto. (Opcional)
 * @param {string} req.query.tipo_contacto - Tipo de contacto. (Opcional)
 * @returns {json} - Contacto(s) encontrado(s). De lo contrario mensaje de error.
 */
async function GET (req, res) {
  try {
    let bindvars = { 
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, 
      id_contacto: (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_persona: (req.query.id_persona === null || typeof req.query.id_persona === 'undefined' || isNaN(req.query.id_persona) || String(req.query.id_persona).trim().length === 0) ? undefined : parseInt(req.query.id_persona),
      desc_contacto: (req.query.desc_contacto === null || typeof req.query.desc_contacto !== 'string' || req.query.desc_contacto.trim().length === 0) ? undefined : req.query.desc_contacto.trim(),
      tipo_contacto: (req.query.tipo_contacto === null || typeof req.query.tipo_contacto !== 'string' || req.query.tipo_contacto.trim().length === 0) ? undefined : req.query.tipo_contacto.trim()
    }
    let result = []
    result = await database.executeGETProcedure('BEGIN SELECTcontacto(:cursor, :id_contacto, :id_persona, :desc_contacto, :tipo_contacto); END;', bindvars)
    if (result.length > 0) {
      res.json({ error: false, data: { contacto: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún contacto.' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Insertar Contacto
 * @param {integer} req.body.ID_PERSONA - ID de la persona a quien pertenecerá el contacto.
 * @param {string} req.body.DESC_CONTACTO - La Descripción del contacto.
 * @param {string} req.body.TIPO_CONTACTO - El Tipo de contacto.
 * @returns {json} - Todos los datos del contacto insertado. De lo contrario mensaje de error.
 */
async function POST (req, res) {
  try {
    let bindvars = { 
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_persona: (req.body.ID_PERSONA === null || typeof req.body.ID_PERSONA === 'undefined' || isNaN(req.body.ID_PERSONA) || String(req.body.ID_PERSONA).trim().length === 0) ? undefined : req.body.ID_PERSONA,
      desc_contacto: (req.body.DESC_CONTACTO === null || typeof req.body.DESC_CONTACTO !== 'string' || req.body.DESC_CONTACTO.trim().length === 0 ) ? undefined : req.body.DESC_CONTACTO.trim(),
      tipo_contacto: (req.body.TIPO_CONTACTO === null || typeof req.body.TIPO_CONTACTO !== 'string' || req.body.TIPO_CONTACTO.trim().length === 0 ) ? undefined : req.body.TIPO_CONTACTO.trim(),
    }
    if (bindvars.id_persona !== undefined && bindvars.desc_contacto !== undefined && bindvars.tipo_contacto !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTcontacto(:cursor, :id_persona, :desc_contacto, :tipo_contacto); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { contacto: result[0] } })
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
 * Actualizar Contacto
 * @param {integer} req.params.id - ID del contacto a actualizar (opcional).
 * @param {integer} req.body.ID_PERSONA - ID del usuario dueño del contacto (opcional).
 * @param {string} req.body.DESC_CONTACTO - Descripción del contacto (opcional).
 * @param {string} req.body.TIPO_CONTACTO - Tipo de contacto (opcional).
 * @returns {json} - Objeto con el contacto actualizado.
 */
async function PUT (req, res) {
  try {
    const id_contacto = (req.params.id === null || typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_contacto != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_contacto: id_contacto,
        id_persona: (req.body.ID_PERSONA === null || typeof req.body.ID_PERSONA === 'undefined' || isNaN(req.body.ID_PERSONA) || String(req.body.ID_PERSONA).trim().length === 0) ? undefined : req.body.ID_PERSONA,
        desc_contacto: (req.body.DESC_CONTACTO === null || typeof req.body.DESC_CONTACTO !== 'string' || req.body.DESC_CONTACTO.trim().length === 0 ) ? undefined : req.body.DESC_CONTACTO.trim(),
        tipo_contacto: (req.body.TIPO_CONTACTO === null || typeof req.body.TIPO_CONTACTO !== 'string' || req.body.TIPO_CONTACTO.trim().length === 0 ) ? undefined : req.body.TIPO_CONTACTO.trim()
      }
      let result = await database.executeProcedure('BEGIN UPDATEcontacto(:cursor, :id_contacto, :id_persona, :desc_contacto, :tipo_contacto); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Contacto Actualizado', contacto: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún contacto' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún contacto' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Contacto
 * @param {integer} req.params.id - ID del contacto a eliminar.
 * @returns {json} - Objeto con el contacto eliminado. De lo contrario mensaje de error.
 */
async function DELETE (req, res) {
  try {
    const id_contacto = (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_contacto != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_contacto: id_contacto }
      let result = await database.executeProcedure('BEGIN DELETEcontacto(:cursor, :id_contacto); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Contacto Eliminado', contacto: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún contacto' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún contacto' } })
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
