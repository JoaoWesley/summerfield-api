import StudyModel from '../../models/studyModel'
import HttpStatus from 'http-status-codes'
import natural from 'natural'

export const postItem = async (req, res) => {
  const item = {
    wordPhrase: req.body.wordPhrase.replace(/^\s|\s$/g, ''),
    translation: req.body.translation,
    wordContext: req.body.wordContext
  }

  const userItems = (await StudyModel.findOne({ user: 'admin@gmail.com' }).exec()).items
  let newItem = null

  if (!userItems.find((element) => element.wordPhrase === item.wordPhrase)) {
    newItem = item
    await StudyModel.findOneAndUpdate({ user: 'admin@gmail.com' }, { $push: { items: newItem } })
  }

  if (!newItem) {
    await StudyModel.findOneAndUpdate(
      { user: 'admin@gmail.com', 'items.wordPhrase': item.wordPhrase },
      {
        $set: {
          'items.$.wordPhrase': item.wordPhrase,
          'items.$.translation': item.translation,
          'items.$.wordContext': item.wordContext
        }
      }
    )
  }

  res.status(HttpStatus.CREATED).end()
}

export const getItem = async (req, res) => {
  let userStudyItems = (await StudyModel.findOne({
    user: 'admin@gmail.com'
  }
  ))

  userStudyItems = userStudyItems.items.filter((item) => item.wordPhrase === req.params.wordPhrase.replace(/^\s|\s$/g, ''))

  res.status(HttpStatus.OK).json({ item: userStudyItems.pop() })
}

export const getItems = async (req, res) => {
  const items = (await StudyModel.findOne({
    user: 'admin@gmail.com'
  }
  ))

  res.status(HttpStatus.OK).json(items)
}

export const trimPhrase = async (req, res) => {
  const Regexptokenizer = new natural.RegexpTokenizer({ pattern: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i })
  const arrayOfTokens = Regexptokenizer.tokenize(req.body.phrase)
  let phrase = arrayOfTokens.join('')
  phrase = phrase.replace(/^\s|\s$/g, '')

  res.status(HttpStatus.OK).json({ phrase })
}
