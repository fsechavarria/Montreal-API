'use strict'

let SECRET
let API_PORT
let API_HOST
let DB_USER
let DB_PASSWORD
let DB_CONNECTIONSTRING
let MAIL
let MAIL_PW
const env = process.env.NODE_ENV || 'development'

switch (env) {
  case 'production':
    SECRET = process.env.SECRET

    API_PORT = process.env.API_PORT
    API_HOST = process.env.API_HOST

    DB_USER = process.env.DB_USER
    DB_PASSWORD = process.env.DB_PASSWORD
    DB_CONNECTIONSTRING = process.env.DB_CONNECTIONSTRING

    MAIL = process.env.MAIL
    MAIL_PW = process.env.MAIL_PW

    break
  case 'development':
    SECRET = 'montrealSTJwt'

    API_PORT = '3000'
    API_HOST = 'http://localhost'

    DB_USER = 'montreal'
    DB_PASSWORD = 'montreal1234'
    DB_CONNECTIONSTRING = '0.0.0.0/XE'

    MAIL = 'montrealtest18@gmail.com'
    MAIL_PW = 'montreal1324'

    break;
  default:
    break
}

module.exports = {
  API_HOST,
  API_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTIONSTRING,
  SECRET,
  MAIL,
  MAIL_PW
}
