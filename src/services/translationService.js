import variables from '../config/envVariablesConfig'
import { TranslationServiceClient } from '@google-cloud/translate'
const translatioMock = [
  {
    translatedText: 'vocês',
    model: '',
    glossaryConfig: null,
    detectedLanguageCode: ''
  }
]
const projectId = variables.GCP_PROJECT_ID
const location = 'global'

export const translate = async text => {
  // Instantiates a client
  const translationClient = new TranslationServiceClient({
    projectId,
    keyFilename: variables.GCP_KEY_FILENAME
  })

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: 'pt'
  }

  if (variables.APP_ENV !== 'production') {
    return translatioMock
  }

  const [response] = await translationClient.translateText(request)
  return response.translations
}
