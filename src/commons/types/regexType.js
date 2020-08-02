const regexType = {
  STANDARD_REGEX_TOKENIZER: /([a-zÀ-ÿ-][a-zÀ-ÿ-'`’]+|[0-9._]+|[<br/><br/>]+|.|!|\?|'|"|:|;|,|-)/i,
  WORD: /^[a-zÀ-ÿ-a-zÀ-ÿ-'`’]+$/i,
  NUMBER: /[0-9]+/,
  INVALID_WORD: /^[-]$/,
  PUNCTUATION: /[.,!?;:“”]/,
  DOUBLE_LINE_BREAK: /(\n){2,}/g,
  DOUBLE_LINE_BREAK_TAG: /<br\/><br\/>/g,
  UNIFIED_LINE_BREAK: /(\n){2,}/g,
  UNIFIED_LINE_BREAK_TAG: /((<br\/>[\s]*){2,}){2,}/g
}

export default regexType
