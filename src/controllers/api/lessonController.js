import LessonModel from '../../models/lessonModel'
import WordsModel from '../../models/wordsModel'
import HttpStatus from 'http-status-codes'
import { ObjectId } from 'mongodb'
import natural from 'natural'
import wordStatusType from '../../commons/wordStatusType'

export const getLessons = async (req, res) => {
  const lessons = await LessonModel.find().exec()
  res.json(lessons)
}

export const getLessonById = async (req, res) => {
  const params = req.params
  const lesson = await LessonModel.findById(ObjectId(params.id)).exec()
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  lesson.words = lesson.words.map((word) => {
    const wordDealtAlready = userWords.find((element) => element.text === word.text)
    if (wordDealtAlready) {
      return wordDealtAlready
    }

    const wordbckp = word
    word = {}
    word.text = wordbckp
    word.status = wordStatusType.NEW
    console.log(word)
    return word
  })

  res.json(lesson)
}

export const postLesson = async (req, res) => {
  const lesson = {
    title: req.body.title,
    text: req.body.text
  }
  const tokenizer = new natural.AggressiveTokenizer()

  lesson.words = tokenizer.tokenize(req.body.text).map((word) => {
    const text = word.toLowerCase()
    word = {}
    word.text = text
    return word
  })

  const lessonCreated = await LessonModel.create(lesson)
  res.status(HttpStatus.CREATED).json(lessonCreated)
}
