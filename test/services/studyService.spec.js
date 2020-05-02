/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import * as studyService from '../../src/services/studyService'
import studyModel from '../../src/models/studyModel'
import * as sinon from 'sinon'
import studyItemsMock from '../mocks/studyItemsMock'

describe('Study service', () => {
  it('Should get study items', async () => {
    sinon.stub(studyModel, 'findOne').returns(studyItemsMock)
    const lessons = await studyService.getItems()
    expect(lessons).to.equal(studyItemsMock)
    studyModel.findOne.restore()
  })

  it('Should get study item by word or phrase', async () => {
    sinon.stub(studyModel, 'findOne').returns(studyItemsMock)

    const studyItem = await studyService.getItem(studyItemsMock.items[0].wordPhrase)
    expect(studyItem).to.eql(studyItemsMock.items[0])

    studyModel.findOne.restore()
  })

  it('Should create study item ', async () => {
    const mongoStub = sinon.stub(studyModel, 'findOneAndUpdate').returns({ ...studyItemsMock.items[0] })
    await studyService.createItem({ ...studyItemsMock.items[0] })

    expect(mongoStub.calledOnce).to.be.true
    studyModel.findOneAndUpdate.restore()
  })

  it('Should update study item ', async () => {
    const mongoStub = sinon.stub(studyModel, 'findOneAndUpdate').returns()

    await studyService.updateItem({ ...studyItemsMock.items[0] })
    expect(mongoStub.calledOnce).to.be.true
    studyModel.findOneAndUpdate.restore()
  })

  it('Should create study object from request data ', async () => {
    const requestData = {
      wordPhrase: 'language ',
      translation: 'Linguagem 132123',
      wordContext: 'palavras ao redor da palavra'
    }

    const expctedObject = {
      wordPhrase: 'language',
      translation: 'Linguagem 132123',
      wordContext: 'palavras ao redor da palavra'
    }

    const response = studyService.buildItemFromRequetData(requestData)
    expect(response).to.eql(expctedObject)
  })

  it('Should trim phrase ', async () => {
    const phraseNotTrimmed = 'natural   language   refers'
    const phraseTrimmed = 'natural language refers'

    const response = studyService.trimPhraseWithTokenizer(phraseNotTrimmed)
    expect(response).to.equal(phraseTrimmed)
  })
})
