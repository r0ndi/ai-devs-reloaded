import dotenv from 'dotenv'
import { getTaskName, handleError, showTaskDetials, showAnswerResponse } from './helpers/utils'
import * as aiDevsService from './services/ai-devs'

dotenv.config({ path: './.env' })
process.on('unhandledRejection', handleError)

async function main() {
  const taskName = getTaskName()

  const token = await aiDevsService.getToken(taskName)
  const task = await aiDevsService.getTask(token)
  showTaskDetials(task)

  const answer = await aiDevsService.resolveTask(taskName, task)
  const answerResponse = await aiDevsService.sendAnswer(token, answer)
  showAnswerResponse(answerResponse)
}

main()