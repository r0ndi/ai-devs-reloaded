import express, { Express } from 'express'
import { Server } from '../types/local'
import bodyParser from 'body-parser'
import ngrok from '@ngrok/ngrok'

export async function createApiServer(): Promise<Server> {
  const server = await createExpressServer()
  const url = await createNgrokServer(server)
  return { server, url }
}

async function createExpressServer(): Promise<Express> {
  const app = express()
  app.use(bodyParser.json())
  return app
}

async function createNgrokServer(app: Express): Promise<string> {
  const session = await new ngrok.SessionBuilder().authtokenFromEnv().connect()
  const listener = await session.httpEndpoint().listen()
  ngrok.listen(app as any, listener)
  return listener.url() || ''
}
