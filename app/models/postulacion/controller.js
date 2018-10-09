import database from '../../../database/database'
import oracledb from 'oracledb'
import { formatDate } from '../_helpers'

/**
 * Obtener Postulaciones
 * @param {integer} req.params.id - ID de la postulacion. (Opcional) 
 * @param {integer} req.query.id_alumno - ID del alumno que realizó la postulación. (Opcional)
 * @param {integer} req.query.id_familia - ID de la familia asociada a la postulación. (Opcional)
 * @param {string} req.query.id_seguro - ID del seguro asociado a la postulación. (Opcional)
 * @param {string} req.query.id_programa - ID del programa al que se está postulando. (Opcional)
 * @param {string} req.query.fech_postulacion - Fecha de creación de la postulación. (Opcional)
 * @param {string} req.query.fech_respuesta - Fecha de respuesta de la postulación. (Opcional)
 * @param {integer} req.query.estado - Estado de la postulación. (Aceptado, Rechazado, Pendiente) (Opcional) 
 * @param {integer} req.query.reserva_dinero_pasajes - Dinero de reserva para pasajes. (Opcional)
 * @returns {json} - Objeto con las postulaciones encontrados.
 */
async function GET (req, res) {
	try {
		let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_postulacion: (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? undefined : parseInt(req.params.id),
      id_alumno: (typeof req.query.id_alumno === 'undefined' || isNaN(req.query.id_alumno) || String(req.query.id_alumno).trim().length === 0) ? undefined : parseInt(req.query.id_alumno),
      id_familia: (typeof req.query.id_familia === 'undefined' || isNaN(req.query.id_familia) || String(req.query.id_familia).trim().length === 0) ? undefined : parseInt(req.query.id_familia),
      id_seguro: (typeof req.query.id_seguro === 'undefined' || isNaN(req.query.id_seguro) || String(req.query.id_seguro).trim().length === 0) ? undefined : parseInt(req.query.id_seguro),
      id_programa: (typeof req.query.id_programa === 'undefined' || isNaN(req.query.id_programa) || String(req.query.id_programa).trim().length === 0) ? undefined : parseInt(req.query.id_programa),
      fech_postulacion: (typeof req.query.fech_postulacion !== 'string' || req.query.fech_postulacion.trim().length === 0 || !formatDate(req.query.fech_postulacion.trim())) ? undefined : formatDate(req.query.fech_postulacion.trim()),
      fech_respuesta: (typeof req.query.fech_respuesta !== 'string' || req.query.fech_respuesta.trim().length === 0 || !formatDate(req.query.fech_respuesta.trim())) ? undefined : formatDate(req.query.fech_respuesta.trim()),
      estado: (typeof req.query.estado !== 'string' || req.query.estado.trim().length === 0) ? undefined : req.query.estado.trim().toUpperCase(),
      reserva_dinero_pasajes: (typeof req.query.reserva_dinero_pasajes === 'undefined' || isNaN(req.query.reserva_dinero_pasajes) || String(req.query.reserva_dinero_pasajes).trim().length === 0) ? undefined : parseInt(req.query.reserva_dinero_pasajes),
    }
		let result = []
		result = await database.executeGETProcedure('BEGIN SELECTpostulacion(:cursor, :id_postulacion, :id_alumno, :id_familia, :id_seguro, :id_programa, :fech_postulacion, :fech_respuesta, :estado, :reserva_dinero_pasajes); END;', bindvars)
		if (result.length > 0) {
      res.json({ error: false, data: { postulacion: result } })
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna postulación.' } })
    }
	} catch (err) {
		res.status(500).json({ error: true, data: { message: err } })
	}
}

/**
 * Ingresar Postulación
 * @param {integer} req.body.ID_ALUMNO - ID del alumno que realizó la postulación.
 * @param {integer} req.body.ID_FAMILIA - ID de la familia asociada a la postulación. (Opcional, por defecto null)
 * @param {string} req.body.ID_SEGURO - ID del seguro asociado a la postulación. (Opcional, por defecto null)
 * @param {string} req.body.ID_PROGRAMA - ID del programa al que se está postulando.
 * @param {string} req.body.FECH_POSTULACION - Fecha de creación de la postulación. (Opcional, por defecto fecha actual)
 * @param {string} req.body.FECH_RESPUESTA - Fecha de respuesta de la postulación. (Opcional, por defecto null)
 * @param {integer} req.body.ESTADO - Estado de la postulación. (Aceptado, Rechazado, Pendiente) (Opcional, por defecto Pendiente) 
 * @param {integer} req.body.RESERVA_DINERO_PASAJES - Dinero de reserva para pasajes.
 * @returns {json} - Objeto con las postulaciones encontrados.
 */
async function POST (req, res) {
  try {
    let bindvars = {
			cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO),
      id_familia: (typeof req.body.ID_FAMILIA === 'undefined' || isNaN(req.body.ID_FAMILIA) || String(req.body.ID_FAMILIA).trim().length === 0) ? undefined : parseInt(req.body.ID_FAMILIA),
      id_seguro: (typeof req.body.ID_SEGURO === 'undefined' || isNaN(req.body.ID_SEGURO) || String(req.body.ID_SEGURO).trim().length === 0) ? undefined : parseInt(req.body.ID_SEGURO),
      id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
      fech_postulacion: (typeof req.body.FECH_POSTULACION !== 'string' || req.body.FECH_POSTULACION.trim().length === 0 || !formatDate(req.body.FECH_POSTULACION.trim())) ? formatDate(new Date()) : formatDate(req.body.FECH_POSTULACION.trim()),
      fech_respuesta: (typeof req.body.FECH_RESPUESTA !== 'string' || req.body.FECH_RESPUESTA.trim().length === 0 || !formatDate(req.body.FECH_RESPUESTA.trim())) ? undefined : formatDate(req.body.FECH_RESPUESTA.trim()),
      estado: (typeof req.body.ESTADO !== 'string' || req.body.ESTADO.trim().length === 0) ? 'P' : req.body.ESTADO.trim().toUpperCase(),
      reserva_dinero_pasajes: (typeof req.body.RESERVA_DINERO_PASAJES === 'undefined' || isNaN(req.body.RESERVA_DINERO_PASAJES) || String(req.body.RESERVA_DINERO_PASAJES).trim().length === 0) ? undefined : parseInt(req.body.RESERVA_DINERO_PASAJES),
    }
    if (bindvars.estado !== 'A' && bindvars.estado !== 'R' && bindvars.estado !== 'P') {
      res.status(400).json({ error: true, data: { message: 'El estado debe ser Activo[A], Inactivo[I] o Pendiente[P]' } })
      return
    }
    if (bindvars.id_alumno !== undefined && bindvars.id_programa !== undefined && bindvars.reserva_dinero_pasajes !== undefined) {
      let result = await database.executeProcedure('BEGIN INSERTpostulacion(:cursor, :id_alumno, :id_familia, :id_seguro, :id_programa, :fech_postulacion, :fech_respuesta, :estado, :reserva_dinero_pasajes); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { postulacion: result[0] } })
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
 * @param {integer} req.body.ID_ALUMNO - ID del alumno que realizó la postulación.
 * @param {integer} req.body.ID_FAMILIA - ID de la familia asociada a la postulación. (Opcional, por defecto null)
 * @param {string} req.body.ID_SEGURO - ID del seguro asociado a la postulación. (Opcional, por defecto null)
 * @param {string} req.body.ID_PROGRAMA - ID del programa al que se está postulando.
 * @param {string} req.body.FECH_POSTULACION - Fecha de creación de la postulación. (Opcional, por defecto fecha actual)
 * @param {string} req.body.FECH_RESPUESTA - Fecha de respuesta de la postulación. (Opcional, por defecto null)
 * @param {integer} req.body.ESTADO - Estado de la postulación. (Aceptado, Rechazado, Pendiente) (Opcional, por defecto Pendiente) 
 * @param {integer} req.body.RESERVA_DINERO_PASAJES - Dinero de reserva para pasajes.
 * @returns {json} - Objeto con la postulación actualizada.
 */
async function PUT (req, res) {
  try {
		const id_postulacion = (typeof req.params.id  === 'undefined' || isNaN(req.params.id ) ) ? 0 : parseInt(req.params.id)
    if (id_postulacion != 0) {
      let bindvars = {
        cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
        id_postulacion: id_postulacion,
        id_alumno: (typeof req.body.ID_ALUMNO === 'undefined' || isNaN(req.body.ID_ALUMNO) || String(req.body.ID_ALUMNO).trim().length === 0) ? undefined : parseInt(req.body.ID_ALUMNO),
        id_familia: (typeof req.body.ID_FAMILIA === 'undefined' || isNaN(req.body.ID_FAMILIA) || String(req.body.ID_FAMILIA).trim().length === 0) ? undefined : parseInt(req.body.ID_FAMILIA),
        id_seguro: (typeof req.body.ID_SEGURO === 'undefined' || isNaN(req.body.ID_SEGURO) || String(req.body.ID_SEGURO).trim().length === 0) ? undefined : parseInt(req.body.ID_SEGURO),
        id_programa: (typeof req.body.ID_PROGRAMA === 'undefined' || isNaN(req.body.ID_PROGRAMA) || String(req.body.ID_PROGRAMA).trim().length === 0) ? undefined : parseInt(req.body.ID_PROGRAMA),
        fech_postulacion: (typeof req.body.FECH_POSTULACION !== 'string' || req.body.FECH_POSTULACION.trim().length === 0 || !formatDate(req.body.FECH_POSTULACION.trim())) ? formatDate(new Date()) : formatDate(req.body.FECH_POSTULACION.trim()),
        fech_respuesta: (typeof req.body.FECH_RESPUESTA !== 'string' || req.body.FECH_RESPUESTA.trim().length === 0 || !formatDate(req.body.FECH_RESPUESTA.trim())) ? undefined : formatDate(req.body.FECH_RESPUESTA.trim()),
        estado: (typeof req.body.ESTADO !== 'string' || req.body.ESTADO.trim().length === 0) ? undefined : req.body.ESTADO.trim().toUpperCase(),
        reserva_dinero_pasajes: (typeof req.body.RESERVA_DINERO_PASAJES === 'undefined' || isNaN(req.body.RESERVA_DINERO_PASAJES) || String(req.body.RESERVA_DINERO_PASAJES).trim().length === 0) ? undefined : parseInt(req.body.RESERVA_DINERO_PASAJES),
      }
      if (bindvars.estado !== undefined && bindvars.estado !== 'A' && bindvars.estado !== 'R' && bindvars.estado !== 'P') {
        res.status(400).json({ error: true, data: { message: 'El estado debe ser Activo[A], Inactivo[I] o Pendiente[P]' } })
        return
      }
      let result = await database.executeProcedure('BEGIN UPDATEpostulacion(:cursor, :id_postulacion, :id_alumno, :id_familia, :id_seguro, :id_programa, :fech_postulacion, :fech_respuesta, :estado, :reserva_dinero_pasajes); END;', bindvars)
      if (result && result.length > 0 && result.length === 1) {
        res.json({ error: false, data: { message: 'Postulación Actualizada', postulacion: result[0] } })
      } else {
        res.status(500).json({ error: true, data: { message: 'No se encontró ninguna postulación' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna postulación' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

/**
 * Eliminar Postulación
 * @param {integer} req.params.id - ID de la postulación.
 * @returns {json} - Objeto con la postulación eliminada.
 */
async function DELETE (req, res) {
	try {
    const id_postulacion = (typeof req.params.id === 'undefined' || isNaN(req.params.id) ) ? 0 : parseInt(req.params.id)
    if (id_postulacion != 0) {
      let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }, id_postulacion: id_postulacion }
      let result = await database.executeProcedure('BEGIN DELETEpostulacion(:cursor, :id_postulacion); END;', bindvars)
      if (result && result.length > 0) {
        res.json({ error: false, data: { message: 'Postulación Eliminada', postulacion: result[0] } })
      } else {
        res.status(404).json({ error: true, data: { message: 'No se encontró ninguna postulación' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'No se encontró ninguna postulación' } })
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
