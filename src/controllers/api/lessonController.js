import Lesson from '../../models/lessonModel'
import KnownWords from '../../models/knownWords'
import HttpStatus from 'http-status-codes'
import { ObjectId } from 'mongodb'
import natural from 'natural'

export const getLessons = async (req, res) => {
  const lessons = await Lesson.find().exec()
  res.json(lessons)
}

export const getLessonById = async (req, res) => {
  const params = req.params
  const lesson = await Lesson.findById(ObjectId(params.id)).exec()
  res.json(lesson)
}

export const postLesson = async (req, res) => {
  const lesson = {
    title: req.body.title,
    text: req.body.text
  }
  const tokenizer = new natural.AggressiveTokenizer()
  const knownWords = (await KnownWords.findOne().exec()).words

  lesson.words = tokenizer.tokenize(req.body.text).map((word) => {
    const text = word.toLowerCase()
    word = {}
    word.text = text
    word.known = knownWords.includes(text) || !!text.match(/^\d+$/)
    return word
  })

  const lessonCreated = await Lesson.create(lesson)
  res.status(HttpStatus.CREATED).json(lessonCreated)
}
