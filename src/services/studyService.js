import StudyModel from '../models/studyModel'
import natural from 'natural'
import regexType from './../commons/types/regexType'
import moment from 'moment'
import supermemo2 from 'supermemo2'

const SPACE_START_END = /^\s|\s$/g

export const getItems = async () => {
  const userStudyItems = await StudyModel.findOne({ user: 'admin@gmail.com' })
  return userStudyItems
}

export const getItem = async wordPhrase => {
  const userStudyItems = await StudyModel.findOne({ user: 'admin@gmail.com' })
  const userStudyItem = userStudyItems.items.filter(
    item =>
      item.wordPhrase === wordPhrase.replace(SPACE_START_END, '').toLowerCase()
  )
  return userStudyItem.pop()
}

export const createItem = async item => {
  await StudyModel.findOneAndUpdate(
    { user: 'admin@gmail.com' },
    { $push: { items: item } }
  )
}

export const updateItem = async item => {
  await StudyModel.findOneAndUpdate(
    {
      user: 'admin@gmail.com',
      'items.wordPhrase': new RegExp(item.wordPhrase, 'i')
    },
    {
      $set: {
        'items.$.wordPhrase': item.wordPhrase.toLowerCase(),
        'items.$.translation': item.translation,
        ...(item.wordContext
          ? { 'items.$.wordContext': item.wordContext }
          : {}),
        ...(item.evaluation ? { 'items.$.evaluation': item.evaluation } : {}),
        ...(item.lastReviewedDate
          ? { 'items.$.lastReviewedDate': item.lastReviewedDate }
          : {}),
        ...(item.nextReviewDate
          ? { 'items.$.nextReviewDate': item.nextReviewDate }
          : {})
      },
      ...(item.lessonIds
        ? { $push: { 'items.$.lessonIds': { $each: item.lessonIds } } }
        : {})
    }
  )
}

export const buildItemFromRequetData = requestData => {
  const item = {}

  if (requestData.wordPhrase) {
    item.wordPhrase = requestData.wordPhrase.replace(SPACE_START_END, '')
  }

  if (requestData.translation) {
    item.translation = requestData.translation
  }

  if (requestData.wordContext) {
    item.wordContext = requestData.wordContext
  }

  if (requestData.lessonId) {
    item.lessonIds = [requestData.lessonId]
  }

  item.nextReviewDate = moment().format('YYYY-MM-DD HH:mm')

  return item
}

export const trimPhraseWithTokenizer = phrase => {
  const Regexptokenizer = new natural.RegexpTokenizer({
    pattern: regexType.STANDARD_REGEX_TOKENIZER
  })
  const arrayOfTokens = Regexptokenizer.tokenize(phrase)
  phrase = arrayOfTokens.join('')
  phrase = phrase.replace(SPACE_START_END, '')
  return phrase
}

export const getItemsToReview = async lessonId => {
  let { items } = await getItems()
  if (lessonId) {
    items = items.filter(item => item.lessonIds.includes(lessonId))
  }
  items.sort(
    (a, b) =>
      new Date(a.nextReviewDate).getTime() -
      new Date(b.nextReviewDate).getTime()
  )

  const reviewedInLast24hours = items.filter(item => {
    const diffInHoursLastReviewed = moment().diff(
      moment(item.lastReviewedDate),
      'hours',
      true
    )
    if (diffInHoursLastReviewed > 0 && diffInHoursLastReviewed < 24) {
      return item
    }
  })

  if (lessonId) {
    let maxNumberItemsReview = 20
    maxNumberItemsReview =
      items.length < maxNumberItemsReview ? items.length : maxNumberItemsReview

    let numberOfItemsToReview =
      maxNumberItemsReview - reviewedInLast24hours.length
    numberOfItemsToReview =
      numberOfItemsToReview > 0 ? numberOfItemsToReview : 0
    if (numberOfItemsToReview) {
      return items.slice(0, numberOfItemsToReview)
    }
    return []
  }

  return items
}

export const evaluate = async item => {
  let { evaluation } = item
  item.evaluation = supermemo2(
    evaluation.quality,
    evaluation.schedule,
    evaluation.factor
  )

  item.lastReviewedDate = moment().format('YYYY-MM-DD HH:mm')
  item.nextReviewDate = moment()
    .add(item.evaluation.schedule, 'day')
    .format('YYYY-MM-DD HH:mm')

  await updateItem(item)
  return item
}
