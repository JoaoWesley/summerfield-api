/* eslint-env mocha */
/* eslint */
import HttpStatus from 'http-status-codes'
import * as sinon from 'sinon'
import lessonsMock from '../mocks/lessonsMock'
import * as lessonsController from '../../src/controllers/api/lessonController'
import * as lessonService from '../../src/services/lessonService'

describe('Lesson controller', () => {
  it('[get lessons] should return 200  and json object', async () => {
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon.stub(lessonService, 'getLessons').returns(
      sinon.stub().resolves(lessonsMock)
    )

    await lessonsController.getLessons(null, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    lessonService.getLessons.restore()
  })

  it('[get lesson by id] should return 200  and json object', async () => {
    const req = {
      params: {
        id: 261786287126
      }
    }
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon.stub(lessonService, 'getLessonById').returns(
      sinon.stub().resolves(lessonsMock[0])
    )

    await lessonsController.getLessonById(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    lessonService.getLessonById.restore()
  })

  it('[post lesson] should return 201 and json object', async () => {
    const req = {
      body: {
      }
    }

    const lessonRequestObject = {
      _id: '5ea3c3580675cc60fc8a275e',
      title: 'Natural language',
      text: 'natural language refers to a language that we, humans use'
    }

    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon.stub(lessonService, 'createLesson').returns(
      sinon.stub().resolves(lessonsMock[0])
    )

    sinon.stub(lessonService, 'buildLessonFromRequestData').returns(
      sinon.stub().resolves(lessonRequestObject)
    )

    await lessonsController.postLesson(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.CREATED))
    sinon.assert.calledOnce(res.status().json)
    lessonService.createLesson.restore()
    lessonService.buildLessonFromRequestData.restore()
  })

  it('[update lesson] should return 200 and end request', async () => {
    const req = {
      body: {
      }
    }

    const lessonRequestObject = {
      _id: '5ea3c3580675cc60fc8a275e',
      title: 'Natural language',
      text: 'natural language refers to a language that we, humans use'
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(lessonService, 'updateLesson').returns(
      sinon.stub().resolves(lessonsMock[0])
    )

    sinon.stub(lessonService, 'buildLessonFromRequestData').returns(
      sinon.stub().resolves(lessonRequestObject)
    )

    await lessonsController.putLesson(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    lessonService.updateLesson.restore()
    lessonService.buildLessonFromRequestData.restore()
  })

  it('[delete lesson] should return 200 and end request ', async () => {
    const req = {
      params: {
        id: ''
      }
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(lessonService, 'deleteLesson').returns(
      sinon.stub().resolves(lessonsMock[0])
    )

    await lessonsController.deleteLesson(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    lessonService.deleteLesson.restore()
  })
})
