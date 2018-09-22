import database from '../../database/database'
import oracledb from 'oracledb'

/**
 * Autenticar a un usuario.
 * @param {string} req.body.usuario - Usuario del usuario a autenticar.
 * @param {string} req.body.contrasena - Contraseña del usuario a autenticar.
 * @return {json} - 
 */
async function authenticate (req, res) {
  let bindvars = 
  { 
    cursor:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
  }
  let result = []
  try {
    result = await database.executeProcedure('BEGIN SELECTusuario(:cursor); END;', bindvars)
  } catch (err) {
    console.error(err.message)
  }
  
  if (result.length > 0) {
    let usr
    result.forEach(user => {
      if (user.USUARIO === req.body.usuario && user.CONTRASENA === req.body.contrasena) {
        usr = user
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
}

module.exports = {
  authenticate
}