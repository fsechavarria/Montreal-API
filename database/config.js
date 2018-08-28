import { DB_USER, DB_PASSWORD, DB_CONNECTIONSTRING } from '../config'

module.exports = {
  dbPool: {
    user: DB_USER,
    password: DB_PASSWORD,
    connectString: DB_CONNECTIONSTRING,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
}
