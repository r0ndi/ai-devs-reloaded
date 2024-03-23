import axios from 'axios'
import { getTaskResolver } from '../helpers/tasks' 
import { AnswerResponse, TaskAnswerResponse, TaskResponse, TokenResponse } from '../types/remote'

export async function getToken(task: string): Promise<string> {
  const { data: { token } } = await axios.post<TokenResponse>(
    `${process.env.AI_DEVS_API_URL}/token/${task}`, { apikey: process.env.AI_DEVS_API_KEY }
  )
  return token
}

export async function getTask(token: string): Promise<TaskResponse> {
  const { data } = await axios.get<TaskResponse>(`${process.env.AI_DEVS_API_URL}/task/${token}`)
  return { ...data, token }
}

export async function sendTaskParams(token: string, params: Record<string, string>): Promise<TaskAnswerResponse> {
  const urlParms = new URLSearchParams(params)
  const { data } = await axios.post<TaskAnswerResponse>(`${process.env.AI_DEVS_API_URL}/task/${token}`, urlParms)
  return data
}

export async function sendTaskAnswer(token: string, answer: unknown): Promise<AnswerResponse> {
  const { data } = await axios.post<AnswerResponse>(`${process.env.AI_DEVS_API_URL}/answer/${token}`, { answer })
  return data
}

export async function resolveTask(task: string, response: TaskResponse): Promise<unknown> {
  const taskResolverFn = await getTaskResolver(task)
  if (!taskResolverFn) {
    throw new Error(`Not found resolver for ${task}`)
  }
  return taskResolverFn(response)
}
