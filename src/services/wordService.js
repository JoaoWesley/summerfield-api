import WordsModel from '../models/wordsModel'
import wordStatusType from '../commons/wordStatusType'

export const createWords = async (words) => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  const newWords = words.filter((word) => {
    return !userWords.find((userWord) => userWord.text === word.text.toLowerCase())
  })

  await WordsModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { words: { $each: newWords } } })
}

export const updateWord = async (word) => {
  await WordsModel.findOneAndUpdate(
    { user: 'admin@gmail.com', 'words.text': word.text.toLowerCase() },
    {
      $set: {
        'words.$.status': word.status
      }
    }
  )
}

export const getStatusReport = async () => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words
  const learningWords = userWords.filter((word) => word.status === wordStatusType.LEARNING)
  const knownWords = userWords.filter((word) => word.status === wordStatusType.KNOWN)

  return {
    learningWords,
    knownWords
  }
}

export const buildWordsFromRequest = (words) => {
  return words.map((word) => {
    return {
      text: word.text.toLowerCase(),
      status: word.status
    }
  })
}
