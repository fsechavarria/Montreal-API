import multer from 'multer'
import path from 'path'
import fs from 'fs'

function generateUUID () { // Public Domain/MIT
  var d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// Cambiar ruta segun directorio actual
const filePath = 'public/antecedentes/'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb (null, filePath)
  },
  filename: function (req, file, cb) {
    cb(null, generateUUID() + '.' + (/(?:\.([^.]+))?$/).exec(file.originalname)[1])
  }
})

const fileFilter = function (req, file, cb) {
  var filetypes = /pdf/
  var mimetype = filetypes.test(file.mimetype)
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  
  if (mimetype && extname) {
    return cb(null, true)
  }
  cb({message: 'File upload only supports the following filetypes - ' + filetypes})
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('ant')

function deleteFile (path) {
  fs.unlink(path, err => { 
    if(err) {
      // Do nothing
    }
  })
}

module.exports = {
  upload,
  deleteFile
}
