import controller from './controller'
import express from 'express'

const app = express()

app.route('/auth')
  .post((req, res) => controller.authenticate(req, res))

export default app
