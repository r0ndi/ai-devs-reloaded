export type TasksConfig = {
  [key: string]: (data: any) => Promise<unknown>
}

export type ErrorHandler = {
  response?: { data?: { msg: string }}
  message?: string
}
