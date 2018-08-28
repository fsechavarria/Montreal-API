'use strict'
// Dependencias
import express from 'express'
import cn from './config'
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

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('combined')) // Logger por consola, muestra request y response

// Se incluyen las rutas privadas y publicas
// a las rutas del servidor
publicRoutes.map (p => app.use('/', p))
privateRoutes.map(p => app.use('/private', p))

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
