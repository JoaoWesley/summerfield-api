export const getLessons = (req, res) => {
  const lessons = [{
    lesson: {
      id: 1,
      title: 'Tyrion',
      words: ['she', 'want'],
      text: 'entire text'
    }
  }]

  res.json(lessons)
}

export const getLessonById = (req, res) => {
  const params = req.params
  const lesson = {
    id: 5,
    title: 'Sansa',
    words: ['she', 'want'],
    text: 'entire text'
  }

  res.json(lesson)
}
