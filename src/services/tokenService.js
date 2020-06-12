import natural from 'natural'
import tokenType from '../commons/tokenType'
import WordsModel from '../models/wordsModel'
import wordStatusType from '../commons/wordStatusType'

export const tokenizeText = (text) => {
  text = text.replace(/(\n){2,}/g, ' <br/><br/> ')
  const tokenizer = new natural.RegexpTokenizer({ pattern: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`’]+|[0-9._]+|[<br/><br/>]+|.|!|\?|'|"|:|;|,|-)/i })
  const tokens = tokenizer.tokenize(text).map((token, index) => {
    const text = token
    token = {}
    token.index = index
    token.text = text
    if (text.match(/^[a-z]+$/i)) {
      token.type = tokenType.WORD
    } else if (text.match(/[0-9]+/)) {
      token.type = tokenType.NUMBER
    } else {
      token.type = tokenType.PUNCTUATION
    }
    return token
  })

  return tokens
}

export const mapTokenStatus = async (tokens) => {
  const userWords = (await WordsModel.findOne({ user: 'admin@gmail.com' }).exec()).words

  tokens.map((token) => {
    if (token.text.match(/[a-z]+/i)) {
      const wordDealtAlready = userWords.find((element) => element.text.toLowerCase() === token.text.toLowerCase())
      if (wordDealtAlready) {
        token.status = wordDealtAlready.status
        return token
      }
    }
    token.status = wordStatusType.NEW
    return token
  })

  return tokens
}

export const createTextFromTokens = (tokens) => {
  return tokens.map((token, index) => {
    let { text } = token
    if (text === '<br/><br/>') {
      text = '\n\n'
    }
    if ((tokens[index + 1] && !tokens[index + 1].text.match(/[.,!?;:“”]/) && !text.match(/[“]/)) || text === '.') {
      return text + ' '
    }
    return text
  }).join('')
}
