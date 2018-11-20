import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Inscripciones
 * @param {integer} req.params.id - ID de la inscripción. (Opcional)
 * @param {integer} req.query.id_programa - ID del programa asociado a la inscripción. (Opcional)
 * @param {integer} req.query.id_curso - ID del curso asociado a la inscripción. (Opcional)
 * @param {integer} req.query.id_alumno - ID del alumno al que pertenece la inscripción. (Opcional)
 * @returns {json} - Objeto con las inscripciones encontradas.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_inscripcion: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_programa: (typeof req.query.id_programa === 'undefined' || isNaN(req.query.id_programa) || String(req.query.id_programa).trim().length === 0) ? undefined : parseInt(req.query.id_programa),
      id_curso: (typeof req.query.id_curso === 'undefined' || isNaN(req.query.id_curso) || String(req.query.id_curso).trim().length === 0) ? undefined : parseInt(req.query.id_curso),
      id_alumno: (typeof req.query.id_alumno === 'undefined' || isNaN(req.query.id_alumno) || String(req.query.id_alumno).trim().length === 0) ? undefined : parseInt(req.query.id_alumno)
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTinscripcion(:cursor, :id_inscripcion, :id_programa, :id_curso, :id_alumno); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { inscripcion: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna inscripción.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Inscripción
 * @param {integer} req.body.ID_PROGRAMA - ID del programa asociado a la inscripción.
 * @param {integer} req.body.ID_ALUMNO - ID del alumno al que pertenece la inscripción.
 * @returns {json} - Objeto con la inscripción ingresada.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
      id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO)
    }
    if (bindvars.id_programa !== undefined && bindvars.id_alumno !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTinscripcion(:cursor, :id_programa, :id_alumno); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { inscripcion: result } })
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
 * Actualizar Inscripción
 * @param {integer} req.params.id - ID de la inscripción.
 * @param {integer} req.body.ID_PROGRAMA - ID del programa asociado a la inscripción. (Opcional)
 * @param {integer} req.body.ID_CURSO - ID del curso asociado a la inscripción. (Opcional)
 * @param {integer} req.body.ID_ALUMNO - ID del alumno al que pertenece la inscripción. (Opcional)
 * @returns {json} - Objeto con la inscripción actualizado.
 */
async function PUT (req, res) {
  try {
		const id_inscripcion = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_inscripcion != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_inscripcion: id_inscripcion,
        id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
        id_curso: (typeof req.body.ID_CURSO === 'undefined' || isNaN(req.body.ID_CURSO) || String(req.body.ID_CURSO).trim().length === 0) ? undefined : parseInt(req.body.ID_CURSO),
        id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO)
      }
      let result = await database.executeProcedure('BEGIN UPDATEinscripcion(:cursor, :id_inscripcion, :id_programa, :id_curso, :id_alumno); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Inscripción Actualizada', inscripcion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna inscripción' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna inscripción' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Inscripción
 * @param {integer} req.params.id - ID de la inscripción.
 * @returns {json} - Objeto con la inscripción eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_inscripcion = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_inscripcion != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_inscripcion: id_inscripcion }
      let result = await database.executeProcedure('BEGIN DELETEinscripcion(:cursor, :id_inscripcion); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Inscripción Eliminada', inscripcion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna inscripción' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna inscripción' } })
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
