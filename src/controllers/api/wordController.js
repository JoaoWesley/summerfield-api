import WordsModel from '../../models/wordsModel'
import HttpStatus from 'http-status-codes'
import wordStatusType from '../../commons/wordStatusType'

export const postWords = async (req, res) => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  const newWords = req.body.words.filter((word) => {
    if (!userWords.find((element) => element.text === word.text.toLowerCase())) {
      return word
    }
  })

  const learningWord = req.body.words.filter((word) => {
    if (userWords.find((element) => element.text === word.text)) {
      return word
    }
  }).pop()

  if (newWords.length > 0) {
    await WordsModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { words: { $each: newWords } } })
  }

  if (learningWord) {
    await WordsModel.findOneAndUpdate(
      { user: 'admin@gmail.com', 'words.text': learningWord.text },
      {
        $set: {
          'words.$.status': learningWord.status
        }
      }
    )
  }
  res.status(HttpStatus.CREATED).end()
}

export const statusReport = async (req, res) => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  const learningWords = userWords.filter((word) => word.status === wordStatusType.LEARNING)
  const knownWords = userWords.filter((word) => word.status === wordStatusType.KNOWN)

  res.status(HttpStatus.OK).json({
    learning: {
      count: learningWords.length,
      words: learningWords
    },

    known: {
      count: knownWords.length,
      words: knownWords
    }
  })
}
