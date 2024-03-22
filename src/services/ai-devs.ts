import axios from 'axios'
import { getTasksConfig } from '../helpers/tasks-config' 
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

export async function sendParamsToTask(token: string, params: URLSearchParams): Promise<TaskAnswerResponse> {
  const { data } = await axios.post<TaskAnswerResponse>(`${process.env.AI_DEVS_API_URL}/task/${token}`, params)
  return data
}

export async function sendAnswer(token: string, answer: unknown): Promise<AnswerResponse> {
  const { data } = await axios.post(`${process.env.AI_DEVS_API_URL}/answer/${token}`, { answer })
  return data
}

export async function resolveTask(task: string, response: TaskResponse): Promise<unknown> {
  const tasksFns = await getTasksConfig()
  if (!tasksFns[task]) {
    throw new Error(`Not found resolver for ${task}`)
  }
  return tasksFns[task](response)
}
