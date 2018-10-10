import database from '../../../database/database'
import oracledb from 'oracledb'

/**
 * Obtener Cursos
 * @param {integer} req.params.id - ID del curso. (Opcional)
 * @param {integer} req.query.id_programa - ID del programa. (Opcional)
 * @param {string} req.query.desc_curso - Descripción del curso. (Opcional)
 * @param {integer} req.query.cupos - Cupos del curso. (Opcional)
 * @returns {json} - Objeto con los cursos encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_curso: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_programa: (typeof req.query.id_programa === 'undefined' || isNaN(req.query.id_programa) || String(req.query.id_programa).trim().length === 0) ? undefined : parseInt(req.query.id_programa),
      desc_curso: (typeof req.query.desc_curso !== 'string' || req.query.desc_curso.trim().length === 0) ? undefined : req.query.desc_curso.trim(),
      cupos: (typeof req.query.cupos === 'undefined' || isNaN(req.query.cupos) || String(req.query.cupos).trim().length === 0) ? undefined : parseInt(req.query.cupos),
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTcurso(:cursor, :id_curso, :id_programa, :desc_curso, :cupos); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { curso: result } })
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún curso.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Curso
 * @param {integer} req.body.ID_PROGRAMA - ID del programa.
 * @param {string} req.body.DESC_CURSO - Descripción del curso.
 * @param {integer} req.body.CUPOS - Cupos del curso.
 * @returns {json} - Objeto con el curso ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
      desc_curso: (typeof req.body.DESC_CURSO !== 'string' || req.body.DESC_CURSO.trim().length === 0) ? undefined : req.body.DESC_CURSO.trim(),
      cupos: (typeof req.body.CUPOS === 'undefined' || isNaN(req.body.CUPOS) || String(req.body.CUPOS).trim().length === 0) ? undefined : parseInt(req.body.CUPOS),
    }
    if (bindvars.id_programa !== undefined && bindvars.desc_curso !== undefined && bindvars.cupos !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTcurso(:cursor, :id_programa, :desc_curso, :cupos); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { curso: result[0] } })
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
 * Actualizar Curso
 * @param {integer} req.params.id - ID del curso.
 * @param {integer} req.body.ID_PROGRAMA - ID del programa. (Opcional)
 * @param {string} req.body.DESC_CURSO - Descripción del curso. (Opcional)
 * @param {integer} req.body.CUPOS - Cupos del curso. (Opcional)
 * @returns {json} - Objeto con el curso ingresado.
 */
async function PUT (req, res) {
  try {
		const id_curso = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_curso != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_curso: id_curso,
        id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
        desc_curso: (typeof req.body.DESC_CURSO !== 'string' || req.body.DESC_CURSO.trim().length === 0) ? undefined : req.body.DESC_CURSO.trim(),
        cupos: (typeof req.body.CUPOS === 'undefined' || isNaN(req.body.CUPOS) || String(req.body.CUPOS).trim().length === 0) ? undefined : parseInt(req.body.CUPOS),
      }
      let result = await database.executeProcedure('BEGIN UPDATEcurso(:cursor, :id_curso, :id_programa, :desc_curso, :cupos); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Curso Actualizado', curso: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún curso' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún curso' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Curso
 * @param {integer} req.params.id - ID del curso.
 * @returns {json} - Objeto con el curso eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_curso = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_curso != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_curso: id_curso }
      let result = await database.executeProcedure('BEGIN DELETEcurso(:cursor, :id_curso); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Curso Eliminado', curso: result[0] } })
      } else {
        res.status(404).json({ error: false, data: { message: 'No se encontró ningún curso' } })
      }
    } else {
      res.status(404).json({ error: false, data: { message: 'No se encontró ningún curso' } })
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
