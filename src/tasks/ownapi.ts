import * as langchainService from '../services/langchain'
import { Request, Response } from 'express'
import { createApiServer } from '../helpers/server'
import { TaskResponse } from '../types/remote'
import { Model } from '../types/local'

const CONVERSATION_ENDPOINT = '/api/assistant/conversation'

export async function handler(_: TaskResponse): Promise<string> {
  const { url, server } = await createApiServer()

  server.post(CONVERSATION_ENDPOINT, assistantConversation)
  return `${url}${CONVERSATION_ENDPOINT}`
}

async function assistantConversation(req: Request, res: Response): Promise<void> {
  const systemMessage = 'Answer the question very clearly, concise and in Polish. Retrun only answer without additional content.'
  const response = await langchainService.invoke(systemMessage, req.body.question, {}, Model.GPT_4)
  res.send({ reply: response }).status(200)
}
