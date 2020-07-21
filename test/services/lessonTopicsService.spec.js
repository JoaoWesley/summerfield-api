/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import * as lessonTopicsService from '../../src/services/lessonTopicsService'
import * as tokenService from '../../src/services/tokenService'
import LessonTopicsModel from '../../src/models/lessonTopics'
import * as sinon from 'sinon'
import lessonTopicsMock from '../mocks/lessonTopicsMock'

describe('lessonTopicsService', () => {
  it('Should get get lesson topics by lesson id', async () => {
    sinon.stub(LessonTopicsModel, 'find').returns({
      exec: sinon
        .stub()
        .resolves([{ topics: { tokens: lessonTopicsMock[0].tokens } }])
    })
    const lessonsTopics = await lessonTopicsService.getLessonTopicsByLessonId()
    expect(lessonsTopics.pop().tokens).to.equal(lessonTopicsMock[0].tokens)
    LessonTopicsModel.find.restore()
  })

  it('Should get get lesson topics by lesson id and topic', async () => {
    sinon
      .stub(tokenService, 'mapTokenStatus')
      .returns(lessonTopicsMock[0].tokens)
    sinon
      .stub(LessonTopicsModel, 'aggregate')
      .returns([{ topics: { tokens: lessonTopicsMock[0].tokens } }])
    const lessonTopics = await lessonTopicsService.getLessonTopicsByIdAndTopic(
      '5ea3c3580675cc60fc8a275e',
      0
    )
    expect(lessonTopics.topics.tokens).to.equal(lessonTopicsMock[0].tokens)
    LessonTopicsModel.aggregate.restore()
    tokenService.mapTokenStatus.restore()
  })

  it('Should delete lesson topic ', async () => {
    const mongoStub = sinon
      .stub(LessonTopicsModel, 'findOneAndUpdate')
      .returns()

    await lessonTopicsService.deleteLessonTopic('5ea3c3580675cc60fc8a275e', 0)
    expect(mongoStub.calledOnce).to.be.true
    LessonTopicsModel.findOneAndUpdate.restore()
  })

  it('Should update lesson topic', async () => {
    const mongoStub = sinon
      .stub(LessonTopicsModel, 'findOneAndUpdate')
      .returns()
    sinon.stub(tokenService, 'tokenizeText').returns(lessonTopicsMock[0].tokens)

    await lessonTopicsService.updateLessonTopic(
      '5ea3c3580675cc60fc8a275e',
      lessonTopicsMock[0]
    )
    expect(mongoStub.calledOnce).to.be.true
    tokenService.tokenizeText.restore()
    LessonTopicsModel.findOneAndUpdate.restore()
  })
})
