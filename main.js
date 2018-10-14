'use strict'
// Dependencias
import express from 'express'
import cn from './config'
import passport from 'passport'
import strategy from './app/middlewares/jwt-strategy'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { shutdown } from './helpers/_helpers'
// Inicializar base de datos
import database from './database/database'
database.startup()

// Rutas publicas y privadas
import publicRoutes from './app/public.routes'
import privateRoutes from './app/private.routes'

// Instancia de Express
const app = express();

// AUTH
// =========================================
passport.use(strategy.strategy)

// CORS CONFIG
// ==========================================
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    callback(null, true)
  }
}

// Middlewares
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((error, request, response, next) => {
  if (error !== null) {
    return response.json({ error: true, data: { message: 'Invalid JSON' } })
  }
  return next()
})
app.use(passport.initialize())
app.use(morgan('combined')) // Logger por consola, muestra request y response

// Solo para testing!
app.use((req, res, next) => {
  console.log('headers ', req.headers)
  console.log('body ', req.body) 
  next()
})

// Se incluyen las rutas privadas y publicas
// a las rutas del servidor
publicRoutes.map (p => app.use('/', cors(corsOptions), p))
privateRoutes.map(p => app.use('/private', cors(corsOptions), passport.authenticate('jwt', { session: false }), p))

// Se levanta el servidor en el puerto definido en el archivo de configuracion.
app.listen(cn.API_PORT, () => { console.log(`API corriendo en ${cn.API_HOST}:${cn.API_PORT}`) })

process.on('SIGTERM', () => {
  shutdown(app)
})

process.on('SIGINT', () => {
  shutdown(app)
})

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);
 
  shutdown(app, err);
});

export default app
