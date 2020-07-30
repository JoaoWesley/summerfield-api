import feedBackModel from '../models/feedbackModel'

export const buildFeedbackFromRequestData = requestData => {
  const feedback = {}

  if (requestData.text) {
    feedback.text = requestData.text
  }

  if (requestData.category) {
    feedback.category = requestData.category
  }

  return feedback
}

export const createFeedback = async feedback => {
  const feedbackCreated = await feedBackModel.create(feedback)
  return feedbackCreated
}
