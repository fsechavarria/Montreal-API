import nodemailer from 'nodemailer'
import config from '../../../config'

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.MAIL,
    pass: config.MAIL_PW
  }
})

function send (req, res) {
  transporter.sendMail({
    from: config.MAIL,
    to: req.body.TO,
    subject: req.body.SUBJECT,
    text: req.body.TEXT,
  }, (errors, info) => {
    if (errors) {
      res.status(500).json({error: true, data: {message: 'Internal error', error: errors}})
    } else {
      res.json({error: false, data: info})
    }
  })
}

function sendWithAttachment(options, req, res) {
  transporter.sendMail({
    from: 'delbarriotest@gmail.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    attachments: [
      {
        filename: options.fileName,
        path: options.path
      }
    ]
  }, (errors, info) => {
    if (errors) {
      res.status(500).json({error: true, data: {message: 'Internal error', error: errors}})
    } else {
      res.json({error: false, data: info})
    }
  })
}


export default {
  send,
  sendWithAttachment
}
