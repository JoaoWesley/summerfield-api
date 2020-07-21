import natural from 'natural'
import tokenType from '../commons/types/tokenType'
import WordsModel from '../models/wordsModel'
import wordStatusType from '../commons/types/wordStatusType'
import regexType from '../commons/types/regexType'
import tokenSpacerType from '../commons/types/tokenSpacerType'

export const tokenizeText = text => {
  text = text.replace(
    regexType.DOUBLE_LINE_BREAK,
    tokenSpacerType.DOUBLE_LINE_BREAK_TAG
  )
  const tokenizer = new natural.RegexpTokenizer({
    pattern: regexType.STANDARD_REGEX_TOKENIZER
  })
  const tokens = tokenizer.tokenize(text).map((token, index) => {
    const text = token
    token = {}
    token.index = index
    token.text = text
    if (text.match(regexType.WORD)) {
      token.type = tokenType.WORD
    } else if (text.match(regexType.NUMBER)) {
      token.type = tokenType.NUMBER
    } else {
      token.type = tokenType.PUNCTUATION
    }
    return token
  })

  return tokens
}

export const mapTokenStatus = async (tokens, userId) => {
  let userWords = (await WordsModel.findOne({ userId }).exec()).words

  tokens.map(token => {
    if (token.text.match(/[a-z]+/i)) {
      const wordDealtAlready = userWords.find(
        element => element.text.toLowerCase() === token.text.toLowerCase()
      )
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

export const createTextFromTokens = tokens => {
  return tokens
    .map((token, index) => {
      let { text } = token
      if (text.match(regexType.DOUBLE_LINE_BREAK_TAG)) {
        text = tokenSpacerType.DOUBLE_LINE_BREAK
      }
      if (
        (tokens[index + 1] &&
          !tokens[index + 1].text.match(regexType.PUNCTUATION) &&
          !text.match(/[“]/)) ||
        text === '.'
      ) {
        return text + ' '
      }
      return text
    })
    .join('')
}
