import Lesson from '../../models/lessonModel'

export const getLessons = async (req, res) => {
  Lesson.find(function (err, lessons) {
    if (err) return console.error(err)
    res.json(lessons)
  })
}

export const getLessonById = (req, res) => {
  const params = req.params
  Lesson.find({ id: params.id }, function (err, lesson) {
    if (err) return console.error(err)
    res.json(lesson)
  })
}
