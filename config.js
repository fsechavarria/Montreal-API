'use strict'


let SECRET
let API_PORT
let API_HOST
let DB_USER
let DB_PASSWORD
let DB_CONNECTIONSTRING
let MAIL
let CLIENT_ID
let CLIENT_SECRET
let REFRESH_TOKEN
// Get refresh token from https://developers.google.com/oauthplayground/
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
    CLIENT_ID = process.env.CLIENT_ID
    CLIENT_SECRET = process.env.CLIENT_SECRET
    REFRESH_TOKEN = process.env.REFRESH_TOKEN

    break
  case 'development':
    SECRET = 'montrealSTJwt'

    API_PORT = '3000'
    API_HOST = 'http://localhost'

    DB_USER = 'montreal'
    DB_PASSWORD = 'montreal1234'
    DB_CONNECTIONSTRING = '0.0.0.0/XE'

    MAIL = 'montrealtest18@gmail.com'
    CLIENT_ID = '423410269520-6et5dscmsbo9bgsdchl8c1vpqoems5gv.apps.googleusercontent.com'
    CLIENT_SECRET = 'pFvuRmbV6Gcvr8KIgTAut0Vt'
    REFRESH_TOKEN = '1/IvgNNTsoBnr1ee82_gzNWoc7rlgRz_IwkJqEPezIkbQ'

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
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN
}
