import multer from 'multer'
import fileTypes from '../../commons/fileTypes'
import Epub from './epub'
import pdfToText from 'pdf-to-text'
import fs from 'fs'
import InvalidFileTypeExcpetion from './../../exception/invalidFileTypeException'
import mammoth from 'mammoth'

export const uploadFile = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage, limits: { fileSize: 4000000 } }).single('file')

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
    case fileTypes.PDF: {
      return new Promise((resolve, reject) => {
        pdfToText.pdfToText(file.path, function (err, data) {
          if (err) reject(err)          
          resolve({ text: data })
        })
      })    
    }
    case fileTypes.DOCX: {
      const result = await mammoth.extractRawText({ path: file.path })  
      var text = result.value; // The raw text
      return { text }
    }
    default:
      throw new InvalidFileTypeExcpetion()
  }
}

export const deleteFile = async (filePath) => {
  fs.unlinkSync(filePath)
}
