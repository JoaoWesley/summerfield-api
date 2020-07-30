import HttpStatus from 'http-status-codes'
import * as feedbackService from '../../services/feedbackService'

export const postFeedback = async (req, res) => {
  const feedback = feedbackService.buildFeedbackFromRequestData(req.body)

  const feedbackCreated = await feedbackService.createFeedback({
    ...feedback,
    userId: res.userOnRequest.id
  })

  res.status(HttpStatus.CREATED).json(feedbackCreated)
}
