import controller from './controller'
import express from 'express'

const app = express()

app.route('/ciudad/:id([0-9]+)?')
  .get((req, res) => controller.GET(req, res))
  .post((req, res) => controller.POST(req, res))
  .put((req, res) => controller.PUT(req, res))
  .delete((req, res) => controller.DELETE(req, res))

export default app
