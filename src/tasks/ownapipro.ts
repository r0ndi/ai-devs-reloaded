import express, { Request, Response, Express } from 'express'
import * as langchainService from '../services/langchain'
import { FunctionCall, Model } from '../types/local'
import { TaskResponse } from '../types/remote'
import { delay } from '../helpers/utils'
import bodyParser from 'body-parser'
import ngrok from '@ngrok/ngrok'

type CategorizePharseArgs = { args: { type: string, message: string } }

const CONVERSATION_ENDPOINT = '/api/assistant/conversation'
const customerKnowledge: string[] = []

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
  return langchainService.invoke(systemMessage, question, {}, Model.GPT_3_5_TURBO)
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
