export type TokenResponse = {
  token: string
}

export type TaskResponse = {
  token: string
  code: number
  msg: string
  [key: string]: unknown
}

export type TaskAnswerResponse = {
  code: number
  msg: string
  answer: string
}

export type AnswerResponse = {
  code: number
  msg: string
  note: string
}

export type RenderFormResponse = {
  success: boolean
  requestId?: string
  href?: string
}
