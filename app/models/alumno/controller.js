import database from '../../../database/database'
import oracledb from 'oracledb'
import { formatDate } from '../_helpers'

/**
 * Obtener Alumnos
 * @param {integer} req.params.id - ID del alumno. (Opcional)
 * @param {integer} req.query.id_usuario - ID del usuario al que pertenece el alumno. (Opcional)
 * @param {string} req.query.fech_nacimiento - Fecha de nacimiento del alumno. (Opcional)
 * @param {string} req.query.genero - Genero del alumno. (Opcional)
 * @returns {json} - Objeto con los alumnos encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_alumno: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_usuario: (typeof req.query.id_usuario === 'undefined' || isNaN(req.query.id_usuario) || String(req.query.id_usuario).trim().length === 0) ? undefined : parseInt(req.query.id_usuario),
      fech_nacimiento: (typeof req.query.fech_nacimiento !== 'string' || req.query.fech_nacimiento.trim().length === 0 || !formatDate(req.query.fech_nacimiento.trim())) ? undefined : formatDate(req.query.fech_nacimiento.trim()),
      genero: (typeof req.query.genero !== 'string' || req.query.genero.trim().length === 0) ? undefined : req.query.genero.trim()
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTalumno(:cursor, :id_alumno, :id_usuario, :fech_nacimiento, :genero); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { alumno: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún alumno.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Alumno
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el alumno. (Opcional)
 * @param {string} req.body.FECH_NACIMIENTO - Fecha de nacimiento del alumno. (Opcional)
 * @param {string} req.body.GENERO - Genero del alumno. (Opcional)
 * @returns {json} - Objeto con el Alumno ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
      fech_nacimiento: (typeof req.body.FECH_NACIMIENTO !== 'string' || req.body.FECH_NACIMIENTO.trim().length === 0 || !formatDate(req.body.FECH_NACIMIENTO.trim())) ? undefined : formatDate(req.body.FECH_NACIMIENTO.trim()),
      genero: (typeof req.body.GENERO !== 'string' || req.body.GENERO.trim().length === 0) ? undefined : req.body.GENERO.trim()
    }
    if (bindvars.id_usuario !== undefined && bindvars.fech_nacimiento !== undefined && bindvars.genero !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTalumno(:cursor, :id_usuario, :fech_nacimiento, :genero); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { alumno: result[0] } })
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
 * Actualizar Alumno
 * @param {integer} req.params.id - ID de la familia.
 * @param {integer} req.body.ID_USUARIO - ID del usuario al que pertenece el alumno. (Opcional)
 * @param {string} req.body.FECH_NACIMIENTO - Fecha de nacimiento del alumno. (Opcional)
 * @param {string} req.body.GENERO - Genero del alumno. (Opcional)
 * @returns {json} - Objeto con el alumno actualizado.
 */
async function PUT (req, res) {
  try {
		const id_alumno = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_alumno != 0) {
      let bindvars = {
				cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
				id_alumno: id_alumno,
				id_usuario: (typeof req.body.ID_USUARIO === 'undefined' || isNaN(req.body.ID_USUARIO) || String(req.body.ID_USUARIO).trim().length === 0) ? undefined : parseInt(req.body.ID_USUARIO),
        fech_nacimiento: (typeof req.body.FECH_NACIMIENTO !== 'string' || req.body.FECH_NACIMIENTO.trim().length === 0 || !formatDate(req.body.FECH_NACIMIENTO.trim())) ? undefined : formatDate(req.body.FECH_NACIMIENTO.trim()),
        genero: (typeof req.body.GENERO !== 'string' || req.body.GENERO.trim().length === 0) ? undefined : req.body.GENERO.trim()
      }
      let result = await database.executeProcedure('BEGIN UPDATEalumno(:cursor, :id_alumno, :id_usuario, :fech_nacimiento, :genero); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Alumno Actualizado', alumno: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ningún alumno' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún alumno' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Alumno
 * @param {integer} req.params.id - ID del alumno.
 * @returns {json} - Objeto con el alumno eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_alumno = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_alumno != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_alumno: id_alumno }
      let result = await database.executeProcedure('BEGIN DELETEalumno(:cursor, :id_alumno); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Alumno Eliminado', alumno: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún alumno' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún alumno' } })
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
