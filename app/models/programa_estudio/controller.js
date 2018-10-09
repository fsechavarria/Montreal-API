import database from '../../../database/database'
import oracledb from 'oracledb'
import { formatDate } from '../_helpers'

/**
 * Obtener Programas de Estudio
 * @param {integer} req.params.id - ID del programa de estudio. (Opcional) 
 * @param {integer} req.query.id_cem - ID del CEM dueño del programa. (Opcional)
 * @param {integer} req.query.id_cel - ID del CEL que se ofrece para el programa. (Opcional)
 * @param {string} req.query.nomb_programa - Nombre del programa de estudio. (Opcional)
 * @param {string} req.query.desc_programa - Descripción del programa de estudio. (Opcional)
 * @param {string} req.query.fech_inicio - Fecha de inicio del programa de estudio. (Opcional)
 * @param {string} req.query.fech_termino - Fecha de termino del programa de estudio. (Opcional)
 * @param {integer} req.query.cant_min_alumnos - Cantidad máxima de alumnos inscritos. (Opcional)
 * @param {integer} req.query.cant_max_alumnos - Cantidad mínima de alumnos inscritos. (Opcional)
 * @returns {json} - Objeto con los programas de estudio encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_programa: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_cem: (typeof req.query.id_cem === 'undefined' || isNaN(req.query.id_cem) || String(req.query.id_cem).trim().length === 0) ? undefined : parseInt(req.query.id_cem),
      id_cel: (typeof req.query.id_cel === 'undefined' || isNaN(req.query.id_cel) || String(req.query.id_cel).trim().length === 0) ? undefined : parseInt(req.query.id_cel),
      nomb_programa: (typeof req.query.nomb_programa !== 'string' || req.query.nomb_programa.trim().length === 0) ? undefined : req.query.nomb_programa.trim(),
      desc_programa: (typeof req.query.desc_programa !== 'string' || req.query.desc_programa.trim().length === 0) ? undefined : req.query.desc_programa.trim(),
      fech_inicio: (typeof req.query.fech_inicio !== 'string' || req.query.fech_inicio.trim().length === 0 || !formatDate(req.query.fech_inicio.trim())) ? undefined : formatDate(req.query.fech_inicio.trim()),
      fech_termino: (typeof req.query.fech_termino !== 'string' || req.query.fech_termino.trim().length === 0 || !formatDate(req.query.fech_termino.trim())) ? undefined : formatDate(req.query.fech_termino.trim()),
      cant_min_alumnos: (typeof req.query.cant_min_alumnos === 'undefined' || isNaN(req.query.cant_min_alumnos) || String(req.query.cant_min_alumnos).trim().length === 0) ? undefined : parseInt(req.query.cant_min_alumnos),
      cant_max_alumnos: (typeof req.query.cant_max_alumnos === 'undefined' || isNaN(req.query.cant_max_alumnos) || String(req.query.cant_max_alumnos).trim().length === 0) ? undefined : parseInt(req.query.cant_max_alumnos),
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTprograma(:cursor, :id_programa, :id_cem, :id_cel, :nomb_programa, :desc_programa, :fech_inicio, :fech_termino, :cant_min_alumnos, :cant_max_alumnos); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { programa_estudio: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún programa de estudio.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Programa de Estudio
 * @param {integer} req.params.id - ID del programa de estudio.
 * @param {integer} req.body.ID_CEM - ID del CEM dueño del programa.
 * @param {integer} req.body.ID_CEL - ID del CEL que se ofrece para el programa. (Opcional, por defecto null)
 * @param {string} req.body.NOMB_PROGRAMA - Nombre del programa de estudio.
 * @param {string} req.body.DESC_PROGRAMA - Descripción del programa de estudio.
 * @param {string} req.body.FECH_INICIO - Fecha de inicio del programa de estudio.
 * @param {string} req.body.FECH_TERMINO - Fecha de termino del programa de estudio
 * @param {integer} req.body.CANT_MIN_ALUMNOS - Cantidad máxima de alumnos inscritos.
 * @param {integer} req.body.CANT_MAX_ALUMNOS - Cantidad mínima de alumnos inscritos.
 * @returns {json} - Objeto con el programa de estudio ingresado.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_cem: (typeof req.body.ID_CEM === 'undefined' || isNaN(req.body.ID_CEM) || String(req.body.ID_CEM).trim().length === 0) ? undefined : parseInt(req.body.ID_CEM),
      id_cel: (typeof req.body.ID_CEL === 'undefined' || isNaN(req.body.ID_CEL) || String(req.body.ID_CEL).trim().length === 0) ? undefined : parseInt(req.body.ID_CEL),
      nomb_programa: (typeof req.body.NOMB_PROGRAMA !== 'string' || req.body.NOMB_PROGRAMA.trim().length === 0) ? undefined : req.body.NOMB_PROGRAMA.trim(),
      desc_programa: (typeof req.body.DESC_PROGRAMA !== 'string' || req.body.DESC_PROGRAMA.trim().length === 0) ? undefined : req.body.DESC_PROGRAMA.trim(),
      fech_inicio: (typeof req.body.FECH_INICIO !== 'string' || req.body.FECH_INICIO.trim().length === 0 || !formatDate(req.body.FECH_INICIO.trim())) ? undefined : formatDate(req.body.FECH_INICIO.trim()),
      fech_termino: (typeof req.body.FECH_TERMINO !== 'string' || req.body.FECH_TERMINO.trim().length === 0 || !formatDate(req.body.FECH_TERMINO.trim())) ? undefined : formatDate(req.body.FECH_TERMINO.trim()),
      cant_min_alumnos: (typeof req.body.CANT_MIN_ALUMNOS === 'undefined' || isNaN(req.body.CANT_MIN_ALUMNOS) || String(req.body.CANT_MIN_ALUMNOS).trim().length === 0) ? undefined : parseInt(req.body.CANT_MIN_ALUMNOS),
      cant_max_alumnos: (typeof req.body.CANT_MAX_ALUMNOS === 'undefined' || isNaN(req.body.CANT_MAX_ALUMNOS) || String(req.body.CANT_MAX_ALUMNOS).trim().length === 0) ? undefined : parseInt(req.body.CANT_MAX_ALUMNOS),
    }
    if (bindvars.id_cem !== undefined && bindvars.nomb_programa !== undefined && bindvars.desc_programa !== undefined && bindvars.fech_inicio !== undefined &&
          bindvars.fech_termino !== undefined && bindvars.cant_min_alumnos !== undefined && bindvars.cant_max_alumnos !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTprograma(:cursor, :id_cem, :id_cel, :nomb_programa, :desc_programa, :fech_inicio, :fech_termino, :cant_min_alumnos, :cant_max_alumnos); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { programa_estudio: result[0] } })
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
 * Actualizar Programa de estudio
 * @param {integer} req.params.id - ID del programa de estudio. (Opcional)
 * @param {integer} req.body.ID_CEM - ID del CEM dueño del programa. (Opcional)
 * @param {integer} req.body.ID_CEL - ID del CEL que se ofrece para el programa. (Opcional)
 * @param {string} req.body.NOMB_PROGRAMA - Nombre del programa de estudio. (Opcional)
 * @param {string} req.body.DESC_PROGRAMA - Descripción del programa de estudio. (Opcional)
 * @param {string} req.body.FECH_INICIO - Fecha de inicio del programa de estudio. (Opcional)
 * @param {string} req.body.FECH_TERMINO - Fecha de termino del programa de estudio (Opcional)
 * @param {integer} req.body.CANT_MIN_ALUMNOS - Cantidad máxima de alumnos inscritos. (Opcional)
 * @param {integer} req.body.CANT_MAX_ALUMNOS - Cantidad mínima de alumnos inscritos. (Opcional)
 * @returns {json} - Objeto el programa de estudio actualizado
 */
async function PUT (req, res) {
  try {
		const id_programa = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_programa != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_programa: id_programa,
        id_cem: (typeof req.body.ID_CEM === 'undefined' || isNaN(req.body.ID_CEM) || String(req.body.ID_CEM).trim().length === 0) ? undefined : parseInt(req.body.ID_CEM),
        id_cel: (typeof req.body.ID_CEL === 'undefined' || isNaN(req.body.ID_CEL) || String(req.body.ID_CEL).trim().length === 0) ? undefined : parseInt(req.body.ID_CEL),
        nomb_programa: (typeof req.body.NOMB_PROGRAMA !== 'string' || req.body.NOMB_PROGRAMA.trim().length === 0) ? undefined : req.body.NOMB_PROGRAMA.trim(),
        desc_programa: (typeof req.body.DESC_PROGRAMA !== 'string' || req.body.DESC_PROGRAMA.trim().length === 0) ? undefined : req.body.DESC_PROGRAMA.trim(),
        fech_inicio: (typeof req.body.FECH_INICIO !== 'string' || req.body.FECH_INICIO.trim().length === 0 || !formatDate(req.body.FECH_INICIO.trim())) ? undefined : formatDate(req.body.FECH_INICIO.trim()),
        fech_termino: (typeof req.body.FECH_TERMINO !== 'string' || req.body.FECH_TERMINO.trim().length === 0 || !formatDate(req.body.FECH_TERMINO.trim())) ? undefined : formatDate(req.body.FECH_TERMINO.trim()),
        cant_min_alumnos: (typeof req.body.CANT_MIN_ALUMNOS === 'undefined' || isNaN(req.body.CANT_MIN_ALUMNOS) || String(req.body.CANT_MIN_ALUMNOS).trim().length === 0) ? undefined : parseInt(req.body.CANT_MIN_ALUMNOS),
        cant_max_alumnos: (typeof req.body.CANT_MAX_ALUMNOS === 'undefined' || isNaN(req.body.CANT_MAX_ALUMNOS) || String(req.body.CANT_MAX_ALUMNOS).trim().length === 0) ? undefined : parseInt(req.body.CANT_MAX_ALUMNOS),
      }
      let result = await database.executeProcedure('BEGIN UPDATEprograma(:cursor, :id_programa, :id_cem, :id_cel, :nomb_programa, :desc_programa, :fech_inicio, :fech_termino, :cant_min_alumnos, :cant_max_alumnos); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Programa de estudio Actualizado', programa_estudio: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ningún programa de estudio' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún programa de estudio' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Programa de Estudio
 * @param {integer} req.params.id - ID del programa de estudio.
 * @returns {json} - Objeto con el programa de estudio eliminado.
 */
async function DELETE (req, res) {
	try {
    const id_programa = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_programa != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_programa: id_programa }
      let result = await database.executeProcedure('BEGIN DELETEprograma(:cursor, :id_programa); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Programa de estudio Eliminado', programa_estudio: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ningún programa de estudio' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ningún programa de estudio' } })
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
