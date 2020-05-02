/* eslint-env mocha */
/* eslint */
import HttpStatus from 'http-status-codes'
import * as sinon from 'sinon'
import statusReportMock from '../mocks/statusReportMock'
import * as wordController from '../../src/controllers/api/wordController'
import * as wordService from '../../src/services/wordService'

describe('Word controller', () => {
  it('[post words] should return 201 and end request', async () => {
    const req = {
      body: {
        words: ''
      }
    }
    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(wordService, 'createWords').returns(
      sinon.stub().resolves()
    )

    await wordController.postWords(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.CREATED))
    sinon.assert.calledOnce(res.status().end)
    wordService.createWords.restore()
  })

  it('[put word] should return 200 and end request', async () => {
    const req = {
      body: {
        word: ''
      }
    }
    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(wordService, 'updateWord').returns(
      sinon.stub().resolves()
    )

    await wordController.putWord(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    wordService.updateWord.restore()
  })

  it('[statusReport] should return 200 and json object', async () => {
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon.stub(wordService, 'getStatusReport').returns(
      statusReportMock
    )

    await wordController.statusReport(null, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    wordService.getStatusReport.restore()
  })
})
