import PopularTranslationModel from '../models/popularTranslationModel'

export const getPopularTranslation = async translation => {
  const translations = await PopularTranslationModel.find({
    wordPhrase: translation.wordPhrase.toLowerCase()
  })

  if (!translations) {
    return null
  }

  let foundTranslation = null

  //Por equanto retornar somente a primeira encontrada
  foundTranslation = translations.filter(
    t =>
      t.context.sectionId === +translation.context.sectionId &&
      t.context.topicId === +translation.context.topicId &&
      t.context.lessonId === translation.context.lessonId
  )
  if (foundTranslation.length > 0) {
    return returnTranslationWithOcurrences(foundTranslation)
  }

  foundTranslation = translations.filter(
    t =>
      t.context.topicId === +translation.context.topicId &&
      t.context.lessonId === translation.context.lessonId
  )
  if (foundTranslation.length > 0) {
    return returnTranslationWithOcurrences(foundTranslation)
  }

  foundTranslation = translations.filter(
    t => t.context.lessonId === translation.context.lessonId
  )
  if (foundTranslation.length > 0) {
    return returnTranslationWithOcurrences(foundTranslation)
  }

  foundTranslation = getMostOcurredTranslation(translations)
  return returnTranslationWithOcurrences(foundTranslation)
}

export const getMostOcurredTranslation = translations => {
  const transFormedTranslations = translations.map(translation =>
    translation.translation.toLowerCase()
  )

  /**
   * Find most frequent element
   */
  if (transFormedTranslations.length == 0) return null
  var modeMap = {}
  var maxEl = transFormedTranslations[0],
    maxCount = 1
  for (var i = 0; i < transFormedTranslations.length; i++) {
    var el = transFormedTranslations[i]
    if (modeMap[el] == null) modeMap[el] = 1
    else modeMap[el]++
    if (modeMap[el] > maxCount) {
      maxEl = el
      maxCount = modeMap[el]
    }
  }

  // Returns most frequent translation
  return translations.filter(t => t.translation.toLowerCase() === maxEl)
}

export const createTranslation = popularTranslation => {
  popularTranslation.wordPhrase = popularTranslation.wordPhrase.toLowerCase()
  popularTranslation.translation = popularTranslation.translation.toLowerCase()
  return PopularTranslationModel.create(popularTranslation)
}

export const buildTranslationFromQueryString = query => {
  const { wordPhrase, lessonId, topicId, sectionId } = query
  return { wordPhrase, context: { lessonId, topicId, sectionId } }
}

export const returnTranslationWithOcurrences = foundTranslations => {
  if (!foundTranslations) {
    return null
  }
  return {
    occurrences: foundTranslations.length,
    translation: foundTranslations[0].translation
  }
}
