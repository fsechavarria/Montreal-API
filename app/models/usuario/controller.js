import database from '../../../database/database'
import oracledb from 'oracledb'
import { genHash } from '../../autenticacion/_helpers'

/**
 * Obtener Usuarios
 * @param {integer} req.params.id - ID del Usuario. (Opcional) 
 * @param {integer} req.query.id_rol - ID del rol del usuario. (Opcional)
 * @param {integer} req.query.id_direccion - ID de la dirección del usuario. (Opcional)
 * @param {string} req.query.usuario - Usuario(login) del usuario. (Opcional)
 * @param {string} req.query.nombre - Nombre del usuario. (Opcional)
 * @param {string} req.query.app_paterno - Apellido paterno del usuario. (Opcional)
 * @param {string} req.query.app_materno - Apellido materno del usuario. (Opcional)
 * @returns {json} - Objeto con los usuarios encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_rol: (typeof req.query.id_rol === 'undefined' || isNaN(req.query.id_rol) || String(req.query.id_rol).trim().length === 0) ? undefined : parseInt(req.query.id_rol),
      id_direccion: (typeof req.query.id_direccion === 'undefined' || isNaN(req.query.id_direccion) || String(req.query.id_direccion).trim().length === 0) ? undefined : parseInt(req.query.id_direccion),
      usuario: (typeof req.query.usuario === 'undefined' || String(req.query.usuario).trim().length === 0) ? undefined : String(req.query.usuario).trim(),
      contrasena: undefined,
      nombre: (typeof req.query.nombre !== 'string' || req.query.nombre.trim().length === 0) ? undefined : req.query.nombre.trim(),
      app_paterno: (typeof req.query.app_paterno !== 'string' || req.query.app_paterno.trim().length === 0) ? undefined : req.query.app_paterno.trim(),
      app_materno: (typeof req.query.app_materno !== 'string' || req.query.app_materno.trim().length === 0) ? undefined : req.query.app_materno.trim()
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTusuario(:cursor, :id_usuario, :id_rol, :id_direccion, :usuario, :contrasena, :nombre, :app_paterno, :app_materno); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { usuario: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún usuario.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Usuario
 * @param {integer} req.body.ID_ROL - ID del rol del usuario.
 * @param {integer} req.body.ID_DIRECCION - ID de la dirección del usuario.
 * @param {string} req.body.USUARIO - Usuario(login) del usuario.
 * @param {string} req.body.NOMBRE - Nombre del usuario.
 * @param {string} req.body.CONTRASENA - Contraseña del usuario.
 * @param {string} req.body.APP_PATERNO - Apellido paterno del usuario.
 * @param {string} req.body.APP_MATERNO - Apellido materno del usuario.
 * @returns {json} - Objeto con el usuario ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_rol: (typeof req.body.ID_ROL === 'undefined' || isNaN(req.body.ID_ROL) || String(req.body.ID_ROL).trim().length === 0) ? undefined : parseInt(req.body.ID_ROL),
      id_direccion: (typeof req.body.ID_DIRECCION === 'undefined' || isNaN(req.body.ID_DIRECCION) || String(req.body.ID_DIRECCION).trim().length === 0) ? undefined : parseInt(req.body.ID_DIRECCION),
      usuario: (typeof req.body.USUARIO === 'undefined' || String(req.body.USUARIO).trim().length === 0) ? undefined : String(req.body.USUARIO).trim(),
      contrasena: (typeof req.body.CONTRASENA === 'undefined' || String(req.body.CONTRASENA).trim().length === 0) ? undefined : String(req.body.CONTRASENA).trim(),
      nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim(),
      app_paterno: (typeof req.body.APP_PATERNO !== 'string' || req.body.APP_PATERNO.trim().length === 0) ? undefined : req.body.APP_PATERNO.trim(),
      app_materno: (typeof req.body.APP_MATERNO !== 'string' || req.body.APP_MATERNO.trim().length === 0) ? undefined : req.body.APP_MATERNO.trim()
    }
    if (bindvars.id_rol !== undefined && bindvars.id_direccion !== undefined && bindvars.usuario !== undefined
        && bindvars.contrasena !== undefined && bindvars.nombre !== undefined && bindvars.app_paterno !== undefined
          && bindvars.app_materno !== undefined) {
      bindvars.contrasena = genHash(bindvars.contrasena)
      let result = await database.executeProcedure('BEGIN INSERTusuario(:cursor, :id_rol, :id_direccion, :usuario, :contrasena, :nombre, :app_paterno, :app_materno); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { usuario: result[0] } })
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
 * Actualizar Usuario
 * @param {integer} req.params.id - ID del Usuario.
 * @param {integer} req.body.ID_ROL - ID del rol del usuario.
 * @param {integer} req.body.ID_DIRECCION - ID de la dirección del usuario.
 * @param {string} req.body.USUARIO - Usuario(login) del usuario.
 * @param {string} req.body.NOMBRE - Nombre del usuario.
 * @param {string} req.body.CONTRASENA - Contraseña del usuario.
 * @param {string} req.body.APP_PATERNO - Apellido paterno del usuario.
 * @param {string} req.body.APP_MATERNO - Apellido materno del usuario.
 * @returns {json} - Objeto con el usuario actualizado.
 */
async function PUT (req, res) {
  try {
		const id_usuario = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_usuario != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_usuario: id_usuario,
        id_rol: (typeof req.body.ID_ROL === 'undefined' || isNaN(req.body.ID_ROL) || String(req.body.ID_ROL).trim().length === 0) ? undefined : parseInt(req.body.ID_ROL),
        id_direccion: (typeof req.body.ID_DIRECCION === 'undefined' || isNaN(req.body.ID_DIRECCION) || String(req.body.ID_DIRECCION).trim().length === 0) ? undefined : parseInt(req.body.ID_DIRECCION),
        usuario: (typeof req.body.USUARIO === 'undefined' || String(req.body.USUARIO).trim().length === 0) ? undefined : String(req.body.USUARIO).trim(),
        contrasena: (typeof req.body.CONTRASENA === 'undefined' || String(req.body.CONTRASENA).trim().length === 0) ? undefined : String(req.body.CONTRASENA).trim(),
        nombre: (typeof req.body.NOMBRE !== 'string' || req.body.NOMBRE.trim().length === 0) ? undefined : req.body.NOMBRE.trim(),
        app_paterno: (typeof req.body.APP_PATERNO !== 'string' || req.body.APP_PATERNO.trim().length === 0) ? undefined : req.body.APP_PATERNO.trim(),
        app_materno: (typeof req.body.APP_MATERNO !== 'string' || req.body.APP_MATERNO.trim().length === 0) ? undefined : req.body.APP_MATERNO.trim()
      }
      let result = await database.executeProcedure('BEGIN UPDATEusuario(:cursor, :id_usuario, :id_rol, :id_direccion, :usuario, :contrasena, :nombre, :app_paterno, :app_materno); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Usuario Actualizado', usuario: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ningún usuario' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún usuario' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Usuario
 * @param {integer} req.params.id - ID del usuario.
 * @returns {json} - Objeto con el usuario eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_usuario = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_usuario != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_usuario: id_usuario }
      let result = await database.executeProcedure('BEGIN DELETEusuario(:cursor, :id_usuario); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Usuario Eliminado', usuario: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún usuario' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún usuario' } })
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
