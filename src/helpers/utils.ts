import { BaseMessageChunk } from 'langchain/schema'
import { ErrorHandler, FunctionCallResponse } from '../types/local'
import { AnswerResponse, TaskResponse } from '../types/remote'

export function handleError(error: ErrorHandler): void {
  console.error(`Error: ${error.response?.data?.msg || error.message}`)
}

export function showTaskDetails({ code, msg, ...rest }: TaskResponse): void {
  [`Task message: ${msg}`, 'Task data:', rest, '\n'].map((msg: string | object) => console.log(msg))
}

export function showAnswerResponse({ code, note, msg }: AnswerResponse): void {
  [`Answer code: ${code}`, `Answer note: ${note}`, `Answer message: ${msg}`].map((msg: string) => console.log(msg))
}

export function showAnswer(answer: unknown): void {
  console.log('Answer:\n', answer, '\n')
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function parseFunctionCall({ additional_kwargs }: BaseMessageChunk): FunctionCallResponse {
  return additional_kwargs && additional_kwargs.function_call ? {
    args: JSON.parse(additional_kwargs.function_call.arguments),
    name: additional_kwargs.function_call.name,
  } : null
}
