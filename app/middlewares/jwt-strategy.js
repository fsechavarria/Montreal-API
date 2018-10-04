import cn from '../../config'
import passportJWT from 'passport-jwt'
import database from '../../database/database'
import oracledb from 'oracledb'

/**
 * Definir modalidad de la estrategia a utilizar, junto a la private key.
 */
const jwtOptions = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: cn.SECRET
}

/**
 * Inicializa la estrategia a ejecutarse para cada request dentro de rutas privadas.
 * Validará si el token sigue siendo válido, además validará que el usuario siga existiendo en el sistema.
 */
const strategy = new passportJWT.Strategy(jwtOptions, (async (jwt_payload, next) => {
  try {
		let bindvars = {
      cursor: { type: oracledb.CURSOR, dir : oracledb.BIND_OUT },
      id_usuario: jwt_payload.id
		}
		let result = []
		result = await database.executeGETProcedure('BEGIN CHECKAuth(:cursor, :id_usuario); END;', bindvars)
		if (result.length > 0) {
      next(null, result[0])
    } else {
      next(null, false)
    }
	} catch (err) {
		next(null, false)
	}
}))

/* Se exportan las constantes */
module.exports = {
  jwtOptions,
  strategy
}