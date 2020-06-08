import HttpStatus from 'http-status-codes'
import * as studyService from '../../services/studyService'

export const getItems = async (req, res) => {
  const items = await studyService.getItems()

  res.status(HttpStatus.OK).json(items)
}

export const getItem = async (req, res) => {
  const userStudyItem = await studyService.getItem(req.params.wordPhrase)
  res.status(HttpStatus.OK).json({ item: userStudyItem })
}

export const postItem = async (req, res) => {
  const item = studyService.buildItemFromRequetData(req.body)

  await studyService.createItem(item)

  res.status(HttpStatus.CREATED).end()
}

export const putItem = async (req, res) => {
  const item = studyService.buildItemFromRequetData(req.body)

  await studyService.updateItem(item)

  res.status(HttpStatus.OK).end()
}

export const trimPhrase = async (req, res) => {
  const phrase = studyService.trimPhraseWithTokenizer(req.params.phrase)
  res.status(HttpStatus.OK).json({ phrase })
}
