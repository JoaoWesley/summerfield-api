/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import * as wordService from '../../src/services/wordService'
import wordsModel from '../../src/models/wordsModel'
import * as sinon from 'sinon'
import wordsMock from '../mocks/wordsMock'

describe('Word service', () => {
  it('Should create words', async () => {
    sinon.stub(wordsModel, 'findOne').returns({
      exec: sinon.stub().resolves({ words: wordsMock })
    })
    const mongoStub = sinon.stub(wordsModel, 'findOneAndUpdate').returns()
    const wordsPost = [
      {
        text: 'now',
        status: 'NEW'
      },

      {
        text: 'his',
        status: 'NEW'
      },

      {
        text: 'watch',
        status: 'NEW'
      }
    ]
    await wordService.createWords(wordsPost)
    expect(mongoStub.calledOnce).to.be.true
    wordsModel.findOne.restore()
    wordsModel.findOneAndUpdate.restore()
  })

  it('Should update word', async () => {
    const mongoStub = sinon.stub(wordsModel, 'findOneAndUpdate').returns()

    await wordService.updateWord({
      text: 'now',
      status: 'NEW'
    })
    expect(mongoStub.calledOnce).to.be.true

    wordsModel.findOneAndUpdate.restore()
  })

  it('Should get status report', async () => {
    sinon.stub(wordsModel, 'findOne').returns({
      exec: sinon.stub().resolves({ words: wordsMock })
    })

    const expectedStatusReport = {
      learningWords: [
        {
          text: 'meaningful',
          type: 'WORD',
          status: 'LEARNING'
        },
        {
          text: 'natural',
          type: 'WORD',
          status: 'LEARNING'
        }
      ],
      knownWords: [
        {
          text: 'covers',
          type: 'WORD',
          status: 'KNOWN'
        },
        {
          text: 'languages',
          type: 'WORD',
          status: 'KNOWN'
        },
        {
          text: 'humans',
          type: 'WORD',
          status: 'KNOWN'
        }
      ]
    }

    const statusRport = await wordService.getStatusReport()
    expect(statusRport).to.be.eql(expectedStatusReport)
    wordsModel.findOne.restore()
  })

  it('Should create words properly from request', async () => {
    const requestWords = [
      {
        text: 'thanks',
        status: 'NEW',
        anything: 'sasas'
      },

      {
        text: 'his',
        status: 'NEW',
        shahhskjhaksj: 'sasas'
      },

      {
        text: 'watch',
        status: 'NEW',
        anyother: 'sasas'
      }
    ]

    const expectedWords = [
      {
        text: 'thanks',
        status: 'NEW'
      },

      {
        text: 'his',
        status: 'NEW'
      },

      {
        text: 'watch',
        status: 'NEW'
      }
    ]

    const words = wordService.buildWordsFromRequest(requestWords)
    expect(words).to.be.eql(expectedWords)
  })
})
