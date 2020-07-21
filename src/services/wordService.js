import WordsModel from '../models/wordsModel'
import wordStatusType from '../commons/types/wordStatusType'

export const createWords = async (words, userId) => {
  let userWords = (await WordsModel.findOne({ userId }).exec()).words

  const newWords = words.filter(word => {
    return !userWords.find(
      userWord => userWord.text === word.text.toLowerCase()
    )
  })

  await WordsModel.findOneAndUpdate(
    { userId },
    { $push: { words: { $each: newWords } } }
  )
}

export const updateWord = async (word, userId) => {
  await WordsModel.findOneAndUpdate(
    { userId, 'words.text': word.text.toLowerCase() },
    {
      $set: {
        'words.$.status': word.status
      }
    }
  )
}

export const getStatusReport = async userId => {
  let userWords = (await WordsModel.findOne({ userId }).exec()).words
  userWords = userWords.words
  const learningWords = userWords.filter(
    word => word.status === wordStatusType.LEARNING
  )
  const knownWords = userWords.filter(
    word => word.status === wordStatusType.KNOWN
  )

  return {
    learningWords,
    knownWords
  }
}

export const buildWordsFromRequest = words => {
  return words.map(word => {
    return {
      text: word.text.toLowerCase(),
      status: word.status
    }
  })
}
