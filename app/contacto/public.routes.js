import controller from './controller'
import express from 'express'

const app = express()

app.route('/contacto/:id([0-9]+)?')
  .get((req, res) => controller.GET(req, res))
  .post((req, res) => controller.POST(req, res))

export default app
