import * as aiDevsService from '../services/ai-devs'
import { TaskResponse } from '../types/remote'
import { sendCompletions } from '../services/openai'

export async function liar({ token }: TaskResponse): Promise<string> {
  const answer = await sendQuestion(token)
  return checkAnswerIsTruth(answer)
}

async function sendQuestion(token: string): Promise<string> {
  const formParms = new URLSearchParams({ question: 'What is capital of Poland?'})
  const { answer } = await aiDevsService.sendParamsToTask(token, formParms)
  return answer
}

async function checkAnswerIsTruth(answer: string): Promise<string> {
  const systemContext = '### Role: Assistant who answers whether the information provided'
    + ' by the user is related to the topic of country capitals. Return YES or NO'
  const response = await sendCompletions(systemContext, answer)
  return ['YES', 'NO'].includes(response) ? response : 'NO'
}