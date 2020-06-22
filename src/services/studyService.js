import StudyModel from '../models/studyModel'
import natural from 'natural'
import regexType from './../commons/regexType'
const SPACE_START_END = /^\s|\s$/g

export const getItems = async () => {
  const userStudyItems = await StudyModel.findOne({ user: 'admin@gmail.com' })
  return userStudyItems
}

export const getItem = async (wordPhrase) => {
  const userStudyItems = await StudyModel.findOne({ user: 'admin@gmail.com' })
  const userStudyItem = userStudyItems.items.filter((item) => item.wordPhrase === wordPhrase.replace(SPACE_START_END, '').toLowerCase())
  return userStudyItem.pop()
}

export const createItem = async (item) => {
  await StudyModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { items: item } })
}

export const updateItem = async (item) => {
  await StudyModel.findOneAndUpdate(
    { user: 'admin@gmail.com', 'items.wordPhrase': new RegExp(item.wordPhrase, 'i') },
    {
      $set: {
        'items.$.wordPhrase': item.wordPhrase,
        'items.$.translation': item.translation,
        ...(item.wordContext ? { 'items.$.wordContext': item.wordContext } : {})
      }
    }
  )
}

export const buildItemFromRequetData = (requestData) => {
  const item = {}

  if (requestData.wordPhrase) {
    item.wordPhrase = requestData.wordPhrase.replace(SPACE_START_END, '')
  }

  if (requestData.translation) {
    item.translation = requestData.translation
  }

  if (requestData.wordContext) {
    item.wordContext = requestData.wordContext
  }

  return item
}

export const trimPhraseWithTokenizer = (phrase) => {
  const Regexptokenizer = new natural.RegexpTokenizer({ pattern: regexType.STANDARD_REGEX_TOKENIZER })
  const arrayOfTokens = Regexptokenizer.tokenize(phrase)
  phrase = arrayOfTokens.join('')
  phrase = phrase.replace(SPACE_START_END, '')
  return phrase
}
