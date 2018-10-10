import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Calificaciones
 * @param {integer} req.params.id - ID de la calificación. (Opcional)
 * @param {integer} req.query.id_alumno - ID del alumno al que pertenece la calificación. (Opcional)
 * @param {integer} req.query.id_curso - ID del curso al que pertenece la calificación. (Opcional)
 * @param {string} req.query.desc_calificacion - Descripción del seguro. (Opcional)
 * @param {double} req.query.nota - Calificación. (Rango de 1.0 a 7.0) (Opcional)
 * @returns {json} - Objeto con las notas encontradas.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_calificacion: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_alumno: (typeof req.query.id_alumno === 'undefined' || isNaN(req.query.id_alumno) || String(req.query.id_alumno).trim().length === 0) ? undefined : parseInt(req.query.id_alumno),
      id_curso: (typeof req.query.id_curso === 'undefined' || isNaN(req.query.id_curso) || String(req.query.id_curso).trim().length === 0) ? undefined : parseInt(req.query.id_curso),
      desc_calificacion: (typeof req.query.desc_calificacion !== 'string' || req.query.desc_calificacion.trim().length === 0) ? undefined : req.query.desc_calificacion.trim(),
      nota: (typeof req.query.nota === 'undefined' || isNaN(req.query.nota) || String(req.query.nota).trim().length === 0) ? undefined : parseFloat(req.query.nota),
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTcalificacion(:cursor, :id_calificacion, :id_alumno, :id_curso, :desc_calificacion, :nota); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { calificacion: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna calificacion.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Seguro
 * @param {integer} req.body.ID_ALUMNO - ID del alumno al que pertenece la calificación.
 * @param {integer} req.body.ID_CURSO - ID del curso al que pertenece la calificación
 * @param {string} req.body.DESC_CALIFICACION - Descripción del seguro. (Opcional, por defecto null)
 * @param {double} req.body.NOTA - Calificación. (Rango de 1.0 a 7.0).
 * @returns {json} - Objeto con el seguro ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO),
      id_curso: (typeof req.body.ID_CURSO === 'undefined' || isNaN(req.body.ID_CURSO) || String(req.body.ID_CURSO).trim().length === 0) ? undefined : parseInt(req.body.ID_CURSO),
      desc_calificacion: (typeof req.body.DESC_CALIFICACION !== 'string' || req.body.DESC_CALIFICACION.trim().length === 0) ? undefined : req.body.DESC_CALIFICACION.trim(),
      nota: (typeof req.body.NOTA === 'undefined' || isNaN(req.body.NOTA) || String(req.body.NOTA).trim().length === 0) ? undefined : parseFloat(req.body.NOTA),
    }
    if (bindvars.nota !== undefined && (bindvars.nota > 7.0 || bindvars.nota < 1.0)) {
      res.status(500).json({ error: true, data: { message: 'El valor de la nota debe estar entre 1.0 y 7.0' } })
      return
    }
    if (bindvars.id_alumno !== undefined && bindvars.id_curso !== undefined && bindvars.nota !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTcalificacion(:cursor, :id_alumno, :id_curso, :desc_calificacion, :nota); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { calificacion: result[0] } })
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
 * Actualizar Calificación
 * @param {integer} req.params.id - ID de la calificación.
 * @param {integer} req.body.ID_ALUMNO - ID del alumno al que pertenece la calificación. (Opcional)
 * @param {integer} req.body.ID_CURSO - ID del curso al que pertenece la calificación. (Opcional)
 * @param {string} req.body.DESC_CALIFICACION - Descripción del seguro. (Opcional)
 * @param {double} req.body.NOTA - Calificación. (Rango de 1.0 a 7.0) (Opcional)
 * @returns {json} - Objeto con la calificación actualizada.
 */
async function PUT (req, res) {
  try {
		const id_calificacion = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_calificacion != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_calificacion: id_calificacion,
        id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO),
        id_curso: (typeof req.body.ID_CURSO === 'undefined' || isNaN(req.body.ID_CURSO) || String(req.body.ID_CURSO).trim().length === 0) ? undefined : parseInt(req.body.ID_CURSO),
        desc_calificacion: (typeof req.body.DESC_CALIFICACION !== 'string' || req.body.DESC_CALIFICACION.trim().length === 0) ? undefined : req.body.DESC_CALIFICACION.trim(),
        nota: (typeof req.body.NOTA === 'undefined' || isNaN(req.body.NOTA) || String(req.body.NOTA).trim().length === 0) ? undefined : parseFloat(req.body.NOTA),
      }
      if (bindvars.nota !== undefined && (bindvars.nota > 7.0 || bindvars.nota < 1.0)) {
        res.status(500).json({ error: true, data: { message: 'El valor de la nota debe estar entre 1.0 y 7.0' } })
        return
      }
      let result = await database.executeProcedure('BEGIN UPDATEcalificacion(:cursor, :id_calificacion, :id_alumno, :id_curso, :desc_calificacion, :nota); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Calificación Actualizada', calificacion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna calificación' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna calificación' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Calificación
 * @param {integer} req.params.id - ID de la calificación.
 * @returns {json} - Objeto con la calificación eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_calificacion = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_calificacion != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_calificacion: id_calificacion }
      let result = await database.executeProcedure('BEGIN DELETEcalificacion(:cursor, :id_calificacion); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Calificación Eliminada', calificacion: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ninguna calificación' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ninguna calificación' } })
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
