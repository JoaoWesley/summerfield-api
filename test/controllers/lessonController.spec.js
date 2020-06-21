/* eslint-env mocha */
/* eslint */
import HttpStatus from 'http-status-codes'
import * as sinon from 'sinon'
import lessonsMock from '../mocks/lessonsMock'
import lessonsWithTopicsMock from '../mocks/lessonsWithTopicsMock'
import * as lessonsController from '../../src/controllers/api/lessonController'
import * as lessonService from '../../src/services/lessonService'
import * as lessonTopicsService from '../../src/services/lessonTopicsService'
import * as fileService from '../../src/services/file/fileService'

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

  it('[get Lesson Topics By LessonId and topicId] should return 200 and json object ', async () => {
    const req = {
      params: {
        id: ''
      },
      query: {
        topicId: 10
      }
    }

    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    /**
     * Testing with topicId
    */
    sinon.stub(lessonTopicsService, 'getLessonTopicsByIdAndTopic').returns(
      sinon.stub().resolves({})
    )
    await lessonsController.getLessonTopicsByLessonId(req, res)
    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().json)
    lessonTopicsService.getLessonTopicsByIdAndTopic.restore()

    /**
     * Testing without topicId
    */
    req.query.topicId = null
    sinon.stub(lessonTopicsService, 'getLessonTopicsByLessonId').returns(
      sinon.stub().resolves({})
    )
    await lessonsController.getLessonTopicsByLessonId(req, res)
    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledTwice(res.status().json)
    lessonTopicsService.getLessonTopicsByLessonId.restore()
  })

  it('[update lesson topic] should return 200 ', async () => {
    const req = {
      params: {
        id: ''
      },
      body: {

      }
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(lessonTopicsService, 'updateLessonTopic').returns(
      sinon.stub().resolves()
    )

    await lessonsController.putLessonTopic(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    lessonTopicsService.updateLessonTopic.restore()
  })

  it('[delete lesson topic] should return 200 ', async () => {
    const req = {
      params: {
        id: ''
      },
      query: {
        topicId: null
      }
    }

    const res = {
      status: sinon.stub().returns({ end: sinon.spy() })
    }

    sinon.stub(lessonTopicsService, 'deleteLessonTopic').returns(
      sinon.stub().resolves()
    )

    await lessonsController.deleteLessonTopic(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.OK))
    sinon.assert.calledOnce(res.status().end)
    lessonTopicsService.deleteLessonTopic.restore()
  })

  it('[import lesson] should return 201 and json object', async () => {
    const req = {
    }

    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    }

    sinon.stub(fileService, 'uploadFile').returns(
      sinon.stub().resolves({ path: '/filename.epub', originalname: 'original name' })
    )

    sinon.stub(fileService, 'readFile').returns(
      sinon.stub().resolves({ text: 'some file text', title: 'some file title' })
    )

    sinon.stub(fileService, 'deleteFile').returns(
      sinon.stub().resolves()
    )

    sinon.stub(lessonService, 'importLesson').returns(
      sinon.stub().resolves(lessonsWithTopicsMock[0])
    )

    await lessonsController.importLesson(req, res)

    sinon.assert.calledWith(res.status, sinon.match(HttpStatus.CREATED))
    sinon.assert.calledOnce(res.status().json)
    fileService.uploadFile.restore()
    fileService.readFile.restore()
    fileService.deleteFile.restore()
    lessonService.importLesson.restore()
  })
})
