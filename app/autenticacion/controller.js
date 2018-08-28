import database from '../../database/database'
import _ from 'lodash'
/**
 * Autenticar a un usuario.
 * @param {string} req.body.email - Correo electrónico del usuario a autenticar.
 * @param {string} req.body.password - Contraseña del usuario a autenticar.
 * @return {json} NADA POR AHORA, SOLO DATOS DE PRUEBA !
 */
async function authenticate (req, res) {
  const result = await database.simpleExecute('select email, password from usuario')
  let u = _.find(result.rows, (user) => {
    return user.EMAIL === req.body.email && user.PASSWORD === req.body.password
  })

  if (u) {
    res.json({ error: false, data: { data: { email: u.EMAIL, password: u.PASSWORD } } })
  } else {
    res.status(404).json({ error: true, data: { message: 'Usuario o contraseña incorrectos' } })
  }
  
  
}

module.exports = {
  authenticate
}