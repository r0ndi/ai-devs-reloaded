import * as langchainService from '../services/langchain'
import * as aiDevsService from '../services/ai-devs'
import { ChatOpenAICallOptions } from '@langchain/openai'
import { TaskResponse } from '../types/remote'
import { Model } from '../types/local'
import { delay } from '../helpers/utils'

type WhoamiData = TaskResponse & {
  hint: string
}

type AnswerType = {
  success: boolean
  answer: string
}

export async function handler({ hint, token }: WhoamiData): Promise<string> {
  return generateAnswer(token, [hint])
}

async function generateAnswer(token: string, hints: string[]): Promise<string> {
  const { success, answer } = await getAnswer(hints)
  if (success) {
    return answer
  }

  await delay(1000)
  const newHints = await getHints(token, hints)
  return generateAnswer(token, newHints)
}

async function getHints(token: string, hints: string[]): Promise<string[]> {
  const { hint } = await aiDevsService.getTask(token) as WhoamiData
  return [...hints, hint]
}

async function getAnswer(hints: string[]): Promise<AnswerType> {
  const systemMessage = `
    ### Instructions:
    You have to guess who this person is based on hints from the given context.
    In response, return a json object with the answer and success fields.
    If you don't have a clear answer return success = false.
    If you are less than 99% certain about the person's identity return success = false.
    ### Examples:
    { success: false }
    { success: true, answer: 'Jony Wick' }
    ### Context:\n${hints.join('\n')}
  `

  const options: ChatOpenAICallOptions = { response_format: { type: 'json_object' } }
  const response = await langchainService.invoke(systemMessage, '', options, Model.GPT_4_TURBO_PREVIEW)
  return JSON.parse(response)
}
