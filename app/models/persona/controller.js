import database from '../../../database/database'
import oracledb from 'oracledb'
import { formatDate } from '../_helpers'
import RutValidation from './rut_validator'

/**
 * Obtener Postulaciones
 * @param {integer} req.params.id - ID de la persona. (Opcional) 
 * @param {integer} req.query.id_direccion - ID de la dirección de la persona. (Opcional)
 * @param {integer} req.query.id_usuario - ID del usuario al que pertenece la persona. (Opcional)
 * @param {string} req.query.rut - Rut de la persona. (Opcional)
 * @param {string} req.query.nombre - Nombre de la persona. (Opcional)
 * @param {string} req.query.app_paterno - Apellido paterno de la persona. (Opcional)
 * @param {string} req.query.app_materno - Apellido materno de la persona. (Opcional)
 * @param {string} req.query.fech_nacimiento - Fecha de nacimiento de la persona. (Opcional)
 * @returns {json} - Objeto con las personas encontradas
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_persona: (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_direccion: (req.query.id_direccion === null || typeof req.query.id_direccion === 'undefined' || isNaN(req.query.id_direccion) || String(req.query.id_direccion).trim().length === 0) ? undefined : parseInt(req.query.id_direccion),
      id_usuario: (req.query.id_usuario === null || typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) || String(req.query.id_usuario).trim().length === 0) ? undefined : parseInt(req.query.id_usuario),
      rut: (req.query.rut === null || typeof req.query.rut !== 'string' || req.query.rut.trim().length === 0 || !RutValidation(req.query.rut.trim())) ? undefined : RutValidation(req.query.rut.trim()),
      nombre: (req.query.nombre === null || typeof req.query.nombre !== 'string' || req.query.nombre.trim().length === 0) ? undefined : req.query.nombre.trim(),
      app_paterno: (req.query.app_materno === null || typeof req.query.app_paterno !== 'string' || req.query.app_paterno.trim().length === 0) ? undefined : req.query.app_paterno.trim(),
      app_materno: (req.query.app_materno === null || typeof req.query.app_materno !== 'string' || req.query.app_materno.trim().length === 0) ? undefined : req.query.app_materno.trim(),
      fech_nacimiento: (req.query.fech_nacimiento === null || typeof req.query.fech_nacimiento !== 'string' || req.query.fech_nacimiento.trim().length === 0 || !formatDate(req.query.fech_nacimiento.trim())) ? undefined : formatDate(req.query.fech_nacimiento.trim()),
    }
    if (typeof req.query.rut !== 'undefined' && typeof bindvars.rut === 'undefined') {
      res.status(400).json({ error: true, data: { message: 'Rut Inválido.' } })
      return
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTpersona(:cursor, :id_persona, :id_direccion, :id_usuario, :rut, :nombre, :app_paterno, :app_materno, :fech_nacimiento); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { persona: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna persona.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Postulación
 * @param {integer} req.body.ID_DIRECCION - ID de la dirección de la persona.
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece la persona.
 * @param {string} req.body.RUT - Rut de la persona.
 * @param {string} req.body.NOMBRE - Nombre de la persona.
 * @param {string} req.body.APP_PATERNO - Apellido paterno de la persona.
 * @param {string} req.body.APP_MATERNO - Apellido materno de la persona.
 * @param {string} req.body.FECH_NACIMIENTO - Fecha de nacimiento de la persona.
 * @returns {json} - Objeto con la persona ingresada.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_direccion: (req.body.ID_DIRECCION === null || typeof req.body.ID_DIRECCION === 'undefined' || isNaN(req.body.ID_DIRECCION) || String(req.body.ID_DIRECCION).trim().length === 0) ? undefined : parseInt(req.body.ID_DIRECCION),
      id_usuario: (req.body.ID_USUARIO === null || typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
      rut: (req.body.RUT === null || typeof req.body.RUT !== 'string' || req.body.RUT.trim().length === 0 || !RutValidation(req.body.RUT.trim())) ? undefined : RutValidation(req.body.RUT.trim()),
      nombre: (req.body.NOMBRE === null || typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim(),
      app_paterno: (req.body.APP_PATERNO === null || typeof req.body.APP_PATERNO !== 'string' || req.body.APP_PATERNO.trim().length === 0) ? undefined : req.body.APP_PATERNO.trim(),
      app_materno: (req.body.APP_MATERNO === null || typeof req.body.APP_MATERNO !== 'string' || req.body.APP_MATERNO.trim().length === 0) ? undefined : req.body.APP_MATERNO.trim(),
      fech_nacimiento: (req.body.FECH_NACIMIENTO === null || typeof req.body.FECH_NACIMIENTO !== 'string' || req.body.FECH_NACIMIENTO.trim().length === 0 || !formatDate(req.body.FECH_NACIMIENTO.trim())) ? undefined : formatDate(req.body.FECH_NACIMIENTO.trim()),
    }
    if (typeof bindvars.rut === 'undefined') {
      res.status(400).json({ error: true, data: { message: 'Rut Inválido.' } })
      return
    }
    if (bindvars.id_usuario !== undefined && bindvars.id_direccion !== undefined && bindvars.nombre !== undefined &&
         bindvars.app_paterno !== undefined && bindvars.app_materno !== undefined && bindvars.fech_nacimiento !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTpersona(:cursor, :id_direccion, :id_usuario, :rut, :nombre, :app_paterno, :app_materno, :fech_nacimiento); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { persona: result[0] } })
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
 * Actualizar Postulación
 * @param {integer} req.body.ID_PERSONA - ID de la persona.
 * @param {integer} req.body.ID_DIRECCION - ID de la dirección de la persona. (Opcional)
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece la persona. (Opcional)
 * @param {string} req.body.RUT - Rut de la persona. (Opcional)
 * @param {string} req.body.NOMBRE - Nombre de la persona. (Opcional)
 * @param {string} req.body.APP_PATERNO - Apellido paterno de la persona. (Opcional)
 * @param {string} req.body.APP_MATERNO - Apellido materno de la persona. (Opcional)
 * @param {string} req.body.FECH_NACIMIENTO - Fecha de nacimiento de la persona. (Opcional)
 * @returns {json} - Objeto con la persona actualizada.
 */
async function PUT (req, res) {
  try {
		const id_persona = (req.params.id === null || typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_persona != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_persona: id_persona,
        id_direccion: ( req.body.ID_DIRECCION === null || typeof req.body.ID_DIRECCION === 'undefined' || isNaN(req.body.ID_DIRECCION) || String(req.body.ID_DIRECCION).trim().length === 0) ? undefined : parseInt(req.body.ID_DIRECCION),
        id_usuario: (req.body.ID_USUARIO === null || typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
        rut: (req.body.RUT === null || typeof req.body.RUT !== 'string' || req.body.RUT.trim().length === 0 || !RutValidation(req.body.RUT.trim())) ? undefined : RutValidation(req.body.RUT.trim()),
        nombre: (req.body.NOMBRE === null || typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim(),
        app_paterno: (req.body.APP_PATERNO === null || typeof req.body.APP_PATERNO !== 'string' || req.body.APP_PATERNO.trim().length === 0) ? undefined : req.body.APP_PATERNO.trim(),
        app_materno: (req.body.APP_MATERNO === null || typeof req.body.APP_MATERNO !== 'string' || req.body.APP_MATERNO.trim().length === 0) ? undefined : req.body.APP_MATERNO.trim(),
        fech_nacimiento: (req.body.FECH_NACIMIENTO === null || typeof req.body.FECH_NACIMIENTO !== 'string' || req.body.FECH_NACIMIENTO.trim().length === 0 || !formatDate(req.body.FECH_NACIMIENTO.trim())) ? undefined : formatDate(req.body.FECH_NACIMIENTO.trim()),
      }
      if (req.query.rut !== null && typeof req.query.rut !== 'undefined' && typeof bindvars.rut === 'undefined') {
        res.status(400).json({ error: true, data: { message: 'Rut Inválido.' } })
        return
      }
      let result = await database.executeProcedure('BEGIN UPDATEpersona(:cursor, :id_persona, :id_direccion, :id_usuario, :rut, :nombre, :app_paterno, :app_materno, :fech_nacimiento); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Persona Actualizada', persona: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna persona' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna persona' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Persona
 * @param {integer} req.params.id - ID de la persona.
 * @returns {json} - Objeto con la persona eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_persona = (req.params.id === null || typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_persona != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_persona: id_persona }
      let result = await database.executeProcedure('BEGIN DELETEpersona(:cursor, :id_persona); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Persona Eliminada', persona: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna persona' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna persona' } })
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
