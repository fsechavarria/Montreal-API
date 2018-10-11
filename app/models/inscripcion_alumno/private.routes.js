import controller from './controller'
import express from 'express'
import permit from '../../middlewares/permissions'

const app = express()

app.route('/inscripcion_alumno/:id([0-9]+)?')
  .get(permit(), (req, res) => controller.GET(req, res))
  .post(permit(), (req, res) => controller.POST(req, res))
  .put(permit(), (req, res) => controller.PUT(req, res))
  .delete(permit(), (req, res) => controller.DELETE(req, res))

export default app
