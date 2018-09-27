import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Contactos
 * @param {integer} req.params.id - ID del contacto (opcional).
 * @returns {json} - Contacto(s) encontrado(s). De lo contrario mensaje de error.
 */
async function GET (req, res) {
  try {
    let bindvars = { 
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, 
      id_contacto: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_usuario: (typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) ) ? undefined : parseInt(req.query.id_usuario),
      desc_contacto: (typeof req.query.desc_contacto !== 'string' || req.query.desc_contacto.trim().length === 0) ? undefined : req.query.desc_contacto.trim(),
      tipo_contacto: (typeof req.query.tipo_contacto !== 'string' || req.query.tipo_contacto.trim().length === 0) ? undefined : req.query.tipo_contacto.trim()
    }
    let result = []
    result = await database.executeGETProcedure('BEGIN SELECTcontacto(:cursor, :id_contacto, :id_usuario, :desc_contacto, :tipo_contacto); END;', bindvars)
    if (result.length > 0) {
      res.json({ error: false, data: { contactos: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto.' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

/**
 * Insertar Contacto
 * @param {integer} req.body.ID_USUARIO - ID del usuario a quien pertenecerá el contacto.
 * @param {string} req.body.DESC_CONTACTO - La Descripción del contacto.
 * @param {string} req.body.TIPO_CONTACTO - El Tipo de contacto.
 * @returns {json} - Todos los datos del contacto insertado. De lo contrario mensaje de error.
 */
async function POST (req, res) {
  try {
    let bindvars = { 
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: req.body.ID_USUARIO,
      desc_contacto: req.body.DESC_CONTACTO,
      tipo_contacto: req.body.TIPO_CONTACTO,
    }
    let result = await database.executeProcedure('BEGIN INSERTcontacto(:cursor, :id_usuario, :desc_contacto, :tipo_contacto); END;', bindvars)
    if (result && result.length > 0) {
      res.json({ error: false, data: { contacto: result[0] } })
    } else {
      res.status(500).json({ error: true, data: { message: 'Error Interno' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

/**
 * Actualizar Contacto
 * @param {integer} req.params.id - ID del contacto a actualizar (opcional).
 * @param {integer} req.body.ID_USUARIO - ID del usuario dueño del contacto (opcional).
 * @param {string} req.body.DESC_CONTACTO - Descripción del contacto (opcional).
 * @param {string} req.body.TIPO_CONTACTO - Tipo de contacto (opcional).
 * @returns {json} - Objeto con el contacto actualizado.
 */
async function PUT (req, res) {
  try {
    const id_contacto = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_contacto != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_contacto: id_contacto,
        id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) ) ? undefined : req.body.ID_USUARIO,
        desc_contacto: (typeof req.body.DESC_CONTACTO !== 'string' || req.body.DESC_CONTACTO.trim().length === 0 ) ? undefined : req.body.DESC_CONTACTO,
        tipo_contacto: (typeof req.body.TIPO_CONTACTO !== 'string' || req.body.TIPO_CONTACTO.trim().length === 0 ) ? undefined : req.body.TIPO_CONTACTO
      }
      let result = await database.executeProcedure('BEGIN UPDATEcontacto(:cursor, :id_contacto, :id_usuario, :desc_contacto, :tipo_contacto); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Contacto Actualizado', contacto: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'Error Interno' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto' } })
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
    const id_contacto = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_contacto != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_contacto: id_contacto }
      let result = await database.executeProcedure('BEGIN DELETEcontacto(:cursor, :id_contacto); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Contacto Eliminado', contacto: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

module.exports = {
  GET,
  POST,
  PUT,
  DELETE
}
