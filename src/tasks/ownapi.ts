import express, { Request, Response, Express } from 'express'
import * as langchainService from '../services/langchain'
import { TaskResponse } from '../types/remote'
import { Model } from '../types/local'
import bodyParser from 'body-parser'
import ngrok from '@ngrok/ngrok'

const CONVERSATION_ENDPOINT = '/api/assistant/conversation'

export async function handler(_: TaskResponse): Promise<string> {
  const serverUrl = await createApiServer()
  return `${serverUrl}${CONVERSATION_ENDPOINT}`
}

async function createApiServer(): Promise<string> {
  const app = await createExpressServer()
  return createNgrokServer(app)
}

async function createExpressServer(): Promise<Express> {
  const app = express()
  app.use(bodyParser.json())
  app.post(CONVERSATION_ENDPOINT, assistantConversation)
  return app
}

async function createNgrokServer(app: Express): Promise<string> {
  const session = await new ngrok.SessionBuilder().authtokenFromEnv().connect()
  const listener = await session.httpEndpoint().listen()
  ngrok.listen(app as any, listener)
  return listener.url() || ''
}

async function assistantConversation(req: Request, res: Response): Promise<void> {
  const systemMessage = 'Answer the question very clearly, concise and in Polish. Retrun only answer without additional content.'
  const response = await langchainService.invoke(systemMessage, req.body.question, {}, Model.GPT_4)
  res.send({ reply: response }).status(200)
}
