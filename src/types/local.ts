import { TaskResponse } from './remote'

export type TaskResolver = (data: TaskResponse) => Promise<unknown>

export type ErrorHandler = {
  response?: { data?: { msg: string }}
  message?: string
}

export enum Model {
  GPT_4 = 'gpt-4',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview',
}
