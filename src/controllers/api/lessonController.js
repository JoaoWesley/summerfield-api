import LessonModel from '../../models/lessonModel'
import WordsModel from '../../models/wordsModel'
import HttpStatus from 'http-status-codes'
import { ObjectId } from 'mongodb'
import natural from 'natural'
import wordStatusType from '../../commons/wordStatusType'
import tokenType from '../../commons/tokenType'

export const getLessons = async (req, res) => {
  const lessons = await LessonModel.find().exec()
  res.json(lessons)
}

export const getLessonById = async (req, res) => {
  const params = req.params
  const lesson = await LessonModel.findById(ObjectId(params.id)).exec()
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  lesson.tokens = lesson.tokens.map((token) => {
    if (token.text.match(/[a-z]+/)) {
      const wordDealtAlready = userWords.find((element) => element.text === token.text)
      if (wordDealtAlready) {
        token.status = wordDealtAlready.status
        return token
      }
    }
    token.status = wordStatusType.NEW
    return token
  })

  res.json(lesson)
}

export const postLesson = async (req, res) => {
  const lesson = {
    title: req.body.title,
    text: req.body.text
  }
  const tokenizer = new natural.RegexpTokenizer({ pattern: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i })

  lesson.tokens = tokenizer.tokenize(req.body.text).map((token) => {
    const text = token.toLowerCase()
    token = {}
    token.text = text
    if (text.match(/[a-z]+/)) {
      token.type = tokenType.WORD
    } else if (text.match(/[0-9]+/)) {
      token.type = tokenType.NUMBER
    } else {
      token.type = tokenType.PUNCTUATION
    }
    return token
  })

  const lessonCreated = await LessonModel.create(lesson)
  res.status(HttpStatus.CREATED).json(lessonCreated)
}
