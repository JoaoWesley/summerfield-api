import HttpStatus from 'http-status-codes'
import * as wordService from '../../services/wordService'

export const postWords = async (req, res) => {
  await wordService.createWords(req.body.words)
  res.status(HttpStatus.CREATED).end()
}

export const putWord = async (req, res) => {
  await wordService.updateWord(req.body.word)
  res.status(HttpStatus.OK).end()
}

export const statusReport = async (req, res) => {
  const statusReport = await wordService.getStatusReport()

  res.status(HttpStatus.OK).json({
    learning: {
      count: statusReport.learningWords.length,
      words: statusReport.learningWords
    },

    known: {
      count: statusReport.knownWords.length,
      words: statusReport.knownWords
    }
  })
}
