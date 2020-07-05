import PopularTranslationModel from '../models/PopularTranslationModel'


export const getPopularTranslation = (wordPhrase) => {
    const translations = await PopularTranslationModel.findOne(
        { 
            user: 'admin@gmail.com', 
            wordPhrase
        },       
    )
    
    let found = null

    //Por equanto retornar somente a primeira encontrada
    found =  translations.find( (t) => t.context.sectionId === translationcontext.sectionId)
    if(found) {
        return found
    }

    found = translations.find( (t) => t.context.topicId === translationcontext.topicId)
    if(found) {
        return found
    }

    found = translations.find( (t) => t.context.lessonId === translationcontext.lessonId)
    if(found) {
        return found
    }

    return getMoreFrequentTranslation(translations)
}

export const getMoreFrequentTranslation = (translations) => {
    const transFormedTranslations = translations.map( (translation) => translation.translation.toLowerCase())
    
    /**
     * Find most frequent element
     */
    if(transFormedTranslations.length == 0)
    return null;
    var modeMap = {};
    var maxEl = transFormedTranslations[0], maxCount = 1;
    for(var i = 0; i < transFormedTranslations.length; i++)
    {
        var el = transFormedTranslations[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }

    // Returns most frequent translation
    return translations.find( (t) => t.translation.toLowerCase() === maxEl)
}

export const createTranslation = (popularTranslation) => {
    popularTranslation = {
        wordPhrase: 'her',
        translation: 'Exemplo de tradução',
        context: {
            lessonId: '5ef55f36ccd6c47e8259b160',
            topicId: 10,
            sectionId: 6
        }
    }
    return PopularTranslationModel.create(popularTranslation)
}
