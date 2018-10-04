import database from '../../database/database'
import oracledb from 'oracledb'
import jwt from 'jsonwebtoken'
import strategy from '../middlewares/jwt-strategy'
import { comparePass, filter } from './_helpers'

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
      usuario: (typeof req.body.USUARIO === 'undefined' || req.body.USUARIO.trim().length === 0) ? undefined : String(req.body.USUARIO)
    }
    let result = []
    result = await database.executeGETProcedure('BEGIN AUTHusuario(:cursor, :usuario); END;', bindvars)
    if (result && result.length === 1) {
      if (comparePass(req.body.CONTRASENA, result[0].CONTRASENA)) {
        let payload = filter.tokenPayload(result[0])
        let token = jwt.sign(payload, strategy.jwtOptions.secretOrKey)
        res.json({ error: false, data: { token: token } })
      } else {
        res.status(404).json({ error: true, data: { message: 'Usuario o contraseña incorrectos' } })
      }
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
