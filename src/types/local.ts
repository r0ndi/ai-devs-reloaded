import { TaskResponse } from './remote'

export type TaskResolver = (data: TaskResponse) => Promise<unknown>

export type ErrorHandler = {
  response?: { data?: { msg: string }}
  message?: string
}
