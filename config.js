'use strict'


let API_PORT
let API_HOST
let DB_USER
let DB_PASSWORD
let DB_CONNECTIONSTRING
const env = process.env.NODE_ENV || 'development'

switch (env) {
  case 'production':
    API_PORT = process.env.API_PORT
    API_HOST = process.env.API_HOST
    DB_USER = process.env.DB_USER
    DB_PASSWORD = process.env.DB_PASSWORD
    DB_CONNECTIONSTRING = process.env.DB_CONNECTIONSTRING
    break
  case 'development':
    API_PORT = '3000'
    API_HOST = 'http://localhost'
    DB_USER = 'montreal'
    DB_PASSWORD = 'montreal1234'
    DB_CONNECTIONSTRING = '0.0.0.0/XE'
    break;
  default:
    break
}

module.exports = {
  API_HOST,
  API_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTIONSTRING
}
