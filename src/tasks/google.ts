import express, { Request, Response, Express } from 'express'
import { TaskResponse } from '../types/remote'
import bodyParser from 'body-parser'
import ngrok from '@ngrok/ngrok'
import axios from 'axios'

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
  const response = await fetchSiteUrl(req.body.question)
  res.send({ reply: response }).status(200)
}

async function fetchSiteUrl(q: string): Promise<string> {
  const params = { q, engine: 'google', api_key: process.env.SERPAPI_API_KEY }
  const response = await axios(process.env.SERPAPI_API_URL || '', { params })
  const url = response.data.organic_results[0].link
  if (!url) {
    throw new Error(`Not found url for ${q}. Try again!`)
  }
  return url
}
