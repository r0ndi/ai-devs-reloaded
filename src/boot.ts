import dotenv from 'dotenv'
import * as aiDevsService from './services/ai-devs'
import { handleError, showTaskDetails, showAnswerResponse } from './helpers/utils'
import { getTaskName } from './helpers/tasks'

dotenv.config({ path: './.env' })
process.on('unhandledRejection', handleError)

async function main() {
  const taskName = getTaskName()

  const token = await aiDevsService.getToken(taskName)
  const task = await aiDevsService.getTask(token)
  showTaskDetails(task)

  const answer = await aiDevsService.resolveTask(taskName, task)
  const answerResponse = await aiDevsService.sendTaskAnswer(token, answer)
  showAnswerResponse(answerResponse)
}

main()