/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import * as lessonService from '../../src/services/lessonService'
import * as tokenService from '../../src/services/tokenService'
import LessonModel from '../../src/models/lessonModel'
import LessonTopicsModel from '../../src/models/lessonTopics'
import * as sinon from 'sinon'
import lessonsMock from '../mocks/lessonsMock'
import lessonTopicsMock from '../mocks/lessonTopicsMock'

describe('Lesson service', () => {
  it('Should get lessons', async () => {
    sinon.stub(LessonModel, 'find').returns({
      exec: sinon.stub().resolves(lessonsMock)
    })
    const lessons = await lessonService.getLessons()
    expect(lessons).to.equal(lessonsMock)
    LessonModel.find.restore()
  })

  it('Should Get lesson by id', async () => {
    sinon.stub(LessonModel, 'findById').returns({
      exec: sinon.stub().resolves(lessonsMock[0])
    })

    sinon.stub(tokenService, 'mapTokenStatus')
      .returns(lessonsMock[0].tokens)

    const lesson = await lessonService.getLessonById('5ea3c3580675cc60fc8a275e')
    expect(lesson).to.eql(lessonsMock[0])

    tokenService.mapTokenStatus.restore()
    LessonModel.findById.restore()
  })

  it('Should create lesson ', async () => {
    sinon.stub(LessonModel, 'create').returns(lessonsMock[0])
    sinon.stub(tokenService, 'tokenizeText')
      .returns(lessonsMock[0].tokens)

    const lesson = await lessonService.createLesson(lessonsMock[0])
    expect(lesson).to.eql(lessonsMock[0])
    tokenService.tokenizeText.restore()
    LessonModel.create.restore()
  })

  it('Should update lesson ', async () => {
    const mongoStub = sinon.stub(LessonModel, 'findOneAndUpdate').returns()
    sinon.stub(tokenService, 'tokenizeText')
      .returns(lessonsMock[0].tokens)

    await lessonService.updateLesson(lessonsMock[0])
    expect(mongoStub.calledOnce).to.be.true
    tokenService.tokenizeText.restore()
    LessonModel.findOneAndUpdate.restore()
  })

  it('Should delete lesson ', async () => {
    const mongoStub = sinon.stub(LessonModel, 'deleteOne').returns()

    await lessonService.deleteLesson('5ea3c3580675cc60fc8a275e')
    expect(mongoStub.calledOnce).to.be.true
    LessonModel.deleteOne.restore()
  })

  it('Should create lesson object from request data ', async () => {
    const requestData = {
      _id: '5ea3c3580675cc60fc8a275e',
      title: 'Natural language',
      text: 'natural language refers to a language that we, humans use'
    }

    const expectedObject = {
      _id: '5ea3c3580675cc60fc8a275e',
      title: 'Natural language',
      text: 'natural language refers to a language that we, humans use',
      fragment: 'natural language refers to '
    }

    const response = lessonService.buildLessonFromRequestData(requestData)
    expect(response).to.eql(expectedObject)
  })

  it('Should import lesson ', async () => {
    const mongoLessonStub = sinon.stub(LessonModel, 'create').returns(lessonsMock[0])
    const mongoLessonTopicsStub = sinon.stub(LessonTopicsModel, 'create').returns()
    sinon.stub(tokenService, 'tokenizeText').returns([...lessonTopicsMock[0].tokens])
    sinon.stub(tokenService, 'createTextFromTokens').returns('any exmaple test')

    await lessonService.importLesson('5ea3c3580675cc60fc8a275e', 'The title')
    expect(mongoLessonStub.calledOnce).to.be.true
    expect(mongoLessonTopicsStub.calledOnce).to.be.true
    LessonModel.create.restore()
    LessonTopicsModel.create.restore()
    tokenService.tokenizeText.restore()
    tokenService.createTextFromTokens.restore()
  })
})
