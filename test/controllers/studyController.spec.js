/* eslint-env mocha */
/* eslint */
import HttpStatus from 'http-status-codes'
import * as sinon from 'sinon'
import studyItemsMock from '../mocks/studyItemsMock'
import * as studyController from '../../src/controllers/api/studyController'
import * as studyService from '../../src/services/studyService'

describe('Study controller', () => {
  it('[get items] should return 200 and json object', async () => {
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() }),
      userOnRequest: { id: '' }
    }

    sinon
      .stub(studyService, 'getItems')
      .returns(sinon.stub().resolves(studyItemsMock))

    await studyController.getItems(null, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    studyService.getItems.restore()
  })

  it('[get study item by id] should return 200  and json object', async () => {
    const req = {
      params: {
        wordPhrase: 'thanks',
        userOnRequest: { id: '' }
      }
    }
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() }),
      userOnRequest: { id: '' }
    }

    sinon
      .stub(studyService, 'getItem')
      .returns(sinon.stub().resolves(studyItemsMock[0]))

    await studyController.getItem(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    studyService.getItem.restore()
  })

  it('[post study item] should return 201 and json object', async () => {
    const req = {
      body: {}
    }

    const studyItemRequestObject = {
      wordPhrase: 'language',
      translation: 'Linguagem 132123',
      wordContext: 'palavras ao redor da palavra'
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() }),
      userOnRequest: { id: '' }
    }

    sinon
      .stub(studyService, 'createItem')
      .returns(sinon.stub().resolves(studyItemsMock[0]))

    sinon
      .stub(studyService, 'buildItemFromRequetData')
      .returns(sinon.stub().resolves(studyItemRequestObject))

    await studyController.postItem(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.CREATED))
    sinon.assert.calledOnce(res.status().end)
    studyService.createItem.restore()
    studyService.buildItemFromRequetData.restore()
  })

  it('[update item] should return 200 and end request', async () => {
    const req = {
      body: {}
    }

    const studyItemRequestObject = {
      _id: '5ea3c3580675cc60fc8a275e',
      title: 'Natural language',
      text: 'natural language refers to a language that we, humans use'
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() }),
      userOnRequest: { id: '' }
    }

    sinon
      .stub(studyService, 'updateItem')
      .returns(sinon.stub().resolves(studyItemsMock[0]))

    sinon
      .stub(studyService, 'buildItemFromRequetData')
      .returns(sinon.stub().resolves(studyItemRequestObject))

    await studyController.putItem(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    studyService.updateItem.restore()
    studyService.buildItemFromRequetData.restore()
  })

  it('[trim phrase] should return 200 and json object ', async () => {
    const req = {
      params: {
        phrase: ''
      }
    }

    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon
      .stub(studyService, 'trimPhraseWithTokenizer')
      .returns(sinon.stub().resolves({}))

    await studyController.trimPhrase(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    studyService.trimPhraseWithTokenizer.restore()
  })
})
