import variables from '../config/envVariablesConfig'
import { TranslationServiceClient } from '@google-cloud/translate'
import translatioMock from '../../test/mocks/translationMock'
const projectId = variables.GCP_PROJECT_ID
const location = 'global'

export const translate = async text => {
  // Instantiates a client
  const translationClient = new TranslationServiceClient()

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
