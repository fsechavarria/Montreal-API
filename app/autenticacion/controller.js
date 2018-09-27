import database from '../../database/database'
import oracledb from 'oracledb'

/**
 * Autenticar a un usuario.
 * @param {string} req.body.USUARIO - Usuario del usuario a autenticar.
 * @param {string} req.body.CONTRASENA - Contraseña del usuario a autenticar.
 * @return {json} - Usuario encontrado. De lo contrario mensaje de error.
 */
async function authenticate (req, res) {
  try {
    let bindvars = { 
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      usuario: (typeof req.body.USUARIO === 'undefined' || req.body.USUARIO.trim().length === 0) ? undefined : String(req.body.USUARIO),
      contrasena: (typeof req.body.CONTRASENA === 'undefined' || req.body.CONTRASENA.trim().length === 0) ? undefined : String(req.body.CONTRASENA)
    }
    let result = []
    result = await database.executeGETProcedure('BEGIN AUTHusuario(:cursor, :usuario, :contrasena); END;', bindvars)
    if (result && result.length === 1) {
      res.json({ error: false, data: { usuario: result[0] } })
    } else {
      res.status(404).json({ error: true, data: { message: 'Usuario o contraseña incorrectos' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: err } })
  }
}

module.exports = {
  authenticate
}
