import * as aiDevsService from '../services/ai-devs'
import * as openaiService from '../services/openai'
import { TaskResponse } from '../types/remote'

export async function liar({ token }: TaskResponse): Promise<string> {
  const answer = await sendQuestion(token)
  return checkAnswerIsTruth(answer)
}

async function sendQuestion(token: string): Promise<string> {
  const { answer } = await aiDevsService.sendTaskParams(token, { question: 'What is capital of Poland?' })
  return answer
}

async function checkAnswerIsTruth(answer: string): Promise<string> {
  const systemContext = '### Role: Assistant who answers whether the information provided'
    + ' by the user is related to the topic of country capitals. Return YES or NO'
  const response = await openaiService.sendCompletions(systemContext, answer)
  return ['YES', 'NO'].includes(response) ? response : 'NO'
}