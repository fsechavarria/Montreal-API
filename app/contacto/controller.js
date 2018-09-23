import database from '../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Contactos
 * @param {int} req.params.id - ID del contacto (opcional) .
 * @returns {json} - Contacto(s) encontrado(s). De lo contrario mensaje de error.
 */
async function GET (req, res) {
  try {
    let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT } }
    let result = []
    result = await database.executeGETProcedure('BEGIN SELECTcontacto(:cursor); END;', bindvars)
    if (result.length > 0) {
      const id = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
      let contacto
      if (id != 0) {
        result.forEach(c => {
          if (parseInt(c.ID_CONTACTO) === id) {
            contacto = c
            return
          }
        })
        if (contacto) {
          res.json({ error: false, data: { contactos: contacto } })
        } else {
          res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto.' } })
        }
      } else {
        res.json({ error: false, data: { contactos: result } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún contacto.' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

/**
 * Insertar Contacto
 * @param {int} req.body.ID_USUARIO - ID del usuario a quien pertenecerá el contacto.
 * @param {string} req.body.DESC_CONTACTO - La Descripción del contacto.
 * @param {string} req.body.TIPO_CONTACTO - El Tipo de contacto.
 * @returns {json} - ID del contacto insertado. De lo contrario mensaje de error.
 */
async function POST (req, res) {
  try {
    let bindvars = { 
      id_contacto: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      id_usuario: req.body.ID_USUARIO,
      desc_contacto: req.body.DESC_CONTACTO,
      tipo_contacto: req.body.TIPO_CONTACTO
    }
    let result = await database.executeProcedure('BEGIN INSERTcontacto(:id_contacto, :id_usuario, :desc_contacto, :tipo_contacto); END;', bindvars)
    if (result) {
      res.json({ error: false, data: { id_contacto: result.id_contacto } })
    } else {
      res.status(500).json({ error: true, data: { message: 'Error Interno' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

module.exports = {
  GET,
  POST
}