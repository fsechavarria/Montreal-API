import bcrypt from 'bcryptjs'

/**
 * Compara contraseñas encriptadas
 * @param {string} userPassword - Contraseña ingresada por el usuario
 * @param {string} dbPassword - Contraseña encriptada de la base de datos
 * @returns {boolean} True si las contraseñas coinciden.
 */
function comparePass (userPassword, dbPassword) {
  return bcrypt.compareSync(userPassword, dbPassword)
}

/**
 * Generar hash bcrypt en base a texto plano.
 * @param {string} password - Contraseña en texto plano.
 * @return {string} Contraseña como hash bcrypt.
 */
function genHash (password) {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}


var filter = {
	tokenPayload: function (entity) {
		return {
			id: entity.ID_USUARIO,
			nombre: entity.NOMBRE + ' ' + entity.APP_PATERNO + ' ' + entity.APP_MATERNO,
			rol: entity.DESC_ROL
		}
	}
}

module.exports = {
	comparePass,
	genHash,
	filter
}