import StudyModel from '../../models/studyModel'
import HttpStatus from 'http-status-codes'
import natural from 'natural'

export const postItem = async (req, res) => {
  const item = {
    wordPhrase: req.body.wordPhrase,
    translation: req.body.translation
  }
  await StudyModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { items: item } })
  res.status(HttpStatus.CREATED).end()
}

export const trimPhrase = async (req, res) => {
  const Regexptokenizer = new natural.RegexpTokenizer({ pattern: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i })
  const arrayOfTokens = Regexptokenizer.tokenize(req.body.phrase)
  const phrase = arrayOfTokens.join('')

  res.status(HttpStatus.OK).json({ phrase })
}
