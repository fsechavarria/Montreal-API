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
    let bindvars = { cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT } }
    let result = []
    result = await database.executeGETProcedure('BEGIN SELECTusuario(:cursor); END;', bindvars)
  
    if (result.length > 0) {
      let usr
      result.forEach(user => {
        if (user.USUARIO === req.body.USUARIO && user.CONTRASENA === req.body.CONTRASENA) {
          usr = user
          return
        }
      })
      if (usr) {
        res.json({ error: false, data: { usuario: usr } })
      } else {
        res.status(404).json({ error: true, data: { message: 'Usuario o contraseña incorrectos' } })
      }
    } else {
      res.status(404).json({ error: true, data: { message: 'Usuario o contraseña incorrectos' } })
    }
  } catch (err) {
    res.status(500).json({ error: true, data: { message: 'Error Interno' } })
  }
}

module.exports = {
  authenticate
}