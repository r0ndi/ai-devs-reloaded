import * as langchainService from '../services/langchain'
import { createApiServer } from '../helpers/server'
import { TaskResponse } from '../types/remote'
import { FunctionCall } from '../types/local'
import { Request, Response } from 'express'
import { delay } from '../helpers/utils'

type CategorizePharseArgs = { args: { type: string, message: string } }

const CONVERSATION_ENDPOINT = '/api/assistant/conversation'
const customerKnowledge: string[] = []

export async function handler(_: TaskResponse): Promise<string> {
  const { url, server } = await createApiServer()

  server.post(CONVERSATION_ENDPOINT, assistantConversation)
  return `${url}${CONVERSATION_ENDPOINT}`
}

async function assistantConversation(req: Request, res: Response): Promise<void> {
  const { args: { type, message } } = await langchainService.invokeWithFunctionCalling(
    'Categorize user message', req.body.question, [functionSchema],
  ) as unknown as CategorizePharseArgs

  await delay(1000)
  const resolverFn = { 'knowledge': saveToDatabase, 'question': answerQuestion }[type]
  const response = resolverFn && await resolverFn(message)
  res.send({ reply: response }).status(200)
}

function saveToDatabase(data: string): string {
  customerKnowledge.push(data)
  return data
}

async function answerQuestion(question: string): Promise<string> {
  const systemMessage = `
    Answer the question very clearly, concise and in Polish based on provided context.
    ### Context: ${customerKnowledge.join(', ')}
  `
  return langchainService.invoke(systemMessage, question)
}

const functionSchema: FunctionCall = {
  name: 'categorizePharse',
  description: 'Categorize user message',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['question', 'knowledge'],
        description: 'Type depends of customer message. Question - question to answer, Knowledge - some knowledge about the user',
      },
      message: {
        type: 'string',
        description: 'Formatted user message to question or knowledge'
      }
    },
    required: ['type', 'message'],
  }
}
