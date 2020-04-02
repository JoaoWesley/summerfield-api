import WordsModel from '../../models/wordsModel'
import HttpStatus from 'http-status-codes'

export const postWords = async (req, res) => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  const newWords = req.body.words.filter((word) => {
    if (!userWords.find((element) => element.text === word.text)) {
      return word
    }
  })

  const learningWord = req.body.words.filter((word) => {
    if (userWords.find((element) => element.text === word.text)) {
      return word
    }
  })

  await WordsModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { words: { $each: newWords } } })

  await WordsModel.findOneAndUpdate(
    { user: 'admin@gmail.com', 'words.text': learningWord.text },
    {
      $set: {
        'words.$.status': learningWord.status
      }
    }

  )
  res.status(HttpStatus.CREATED).end()
}
