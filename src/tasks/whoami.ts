import * as langchainService from '../services/langchain'
import * as aiDevsService from '../services/ai-devs'
import { ChatOpenAICallOptions } from '@langchain/openai'
import { TaskResponse } from '../types/remote'
import { Model } from '../types/local'

type WhoamiData = TaskResponse & {
  hint: string
}

type AnswerType = {
  success: boolean
  answer: string
}

export async function handler({ hint, token }: WhoamiData): Promise<string> {
  return generateAnswer(token, hint)
}

async function generateAnswer(token: string, hint: string, context: string = ''): Promise<string> {
  const currentContext = `${context}\n- ${hint}`
  const { success, answer } = await getAnswer(currentContext)
  if (success) {
    return answer
  }

  const { hint: nextHint } = await aiDevsService.getTask(token) as WhoamiData
  return generateAnswer(token, nextHint, currentContext)
}

async function getAnswer(context: string): Promise<AnswerType> {
  const systemMessage = `
    ### Instructions:
    You have to guess who this person is based on hints from the given context.
    In response, return a json object with the answer and success fields.
    If you don't have a clear answer return success = false.
    If you are less than 99% certain about the person's identity return success = false.
    ### Examples:
    { success: false }
    { success: true, answer: 'Jony Wick' }
    ### Context: ${context}
  `

  const options: ChatOpenAICallOptions = { response_format: { type: 'json_object' } }
  const response = await langchainService.invoke(systemMessage, '', options, Model.GPT_4_TURBO_PREVIEW)
  return JSON.parse(response)
}
