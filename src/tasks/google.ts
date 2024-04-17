import { createApiServer } from '../helpers/server'
import { TaskResponse } from '../types/remote'
import { Request, Response } from 'express'
import axios from 'axios'

const ENDPOINT = '/api/assistant/conversation'

export async function handler(_: TaskResponse): Promise<string> {
  const { url, server } = await createApiServer()

  server.post(ENDPOINT, assistantConversation)
  return `${url}${ENDPOINT}`
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
