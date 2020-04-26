import StudyModel from '../models/studyModel'
import natural from 'natural'

export const getItems = async () => {
  const items = await StudyModel.findOne({ user: 'admin@gmail.com' })
  return items
}

export const getItem = async (wordPhrase) => {
  let userStudyItems = await StudyModel.findOne({ user: 'admin@gmail.com' })

  userStudyItems = userStudyItems.items.filter((item) => item.wordPhrase === wordPhrase.replace(/^\s|\s$/g, ''))
  return userStudyItems
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
    item.wordPhrase = requestData.wordPhrase.replace(/^\s|\s$/g, '')
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
  const Regexptokenizer = new natural.RegexpTokenizer({ pattern: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i })
  const arrayOfTokens = Regexptokenizer.tokenize(phrase)
  phrase = arrayOfTokens.join('')
  phrase = phrase.replace(/^\s|\s$/g, '')
  return phrase
}
