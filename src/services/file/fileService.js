import multer from 'multer'
import fileTypes from '../../commons/fileTypes'
import Epub from './epub'
import fs from 'fs'

export const uploadFile = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage }).single('file')

  //    await upload.call(req, res)

  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        reject(err)
      } else if (err) {
        reject(err)
      }
      resolve(req.file)
    })
  })
}

export const readFile = async (file) => {
  switch (file.mimetype) {
    case fileTypes.EPUB: {
      const epub = new Epub()
      return epub.getText(file.path)
    }
  }
}

export const deleteFile = async (filePath) => {
  fs.unlinkSync(filePath)
}
