/* eslint-env mocha */
import { expect } from 'chai'
import * as tokenService from '../../src/services/tokenService'
import wordsModel from '../../src/models/wordsModel'
import * as sinon from 'sinon'
import lessonsMock from '../mocks/lessonsMock'
import wordsMock from '../mocks/wordsMock'
import tokensWithStatusMock from '../mocks/tokensWithStatusMock'

describe('Token service', () => {
  it('Should tokenize text', async () => {
    const tokenizedText = tokenService.tokenizeText(lessonsMock[0].text)
    expect(tokenizedText).to.eql(lessonsMock[0].tokens)
  })

  it('Should map tokens status', async () => {
    sinon.stub(wordsModel, 'findOne').returns({
      exec: sinon.stub().resolves({ words: wordsMock })
    })

    const tokens = await tokenService.mapTokenStatus(JSON.parse(JSON.stringify(lessonsMock[0].tokens)))
    expect(tokens).to.eql(tokensWithStatusMock)
    wordsModel.findOne.restore()
  })
})
