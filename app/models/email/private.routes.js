import controller from './controller'
import express from 'express'
import permit from '../../middlewares/permissions'

const app = express()

app.route('/email/:id([0-9]+)?')
  .post((req, res) => controller.send(req, res))

export default app
