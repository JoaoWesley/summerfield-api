import Lesson from '../../models/lessonModel'

export const getLessons = async (req, res) => {
  const lessons = await Lesson.find().exec()
  res.json(lessons)
}

export const getLessonById = async (req, res) => {
  const params = req.params
  const lesson = await Lesson.find({ id: params.id }).exec()
  res.json(lesson)
}
