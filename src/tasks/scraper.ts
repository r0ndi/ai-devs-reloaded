import * as langchainService from '../services/langchain'
import { TaskResponse } from '../types/remote'
import axios, { AxiosError } from 'axios'

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
const MAX_ATTEMPTS = 5

type ScrapperData = TaskResponse & {
  question: string
  input: string
}

type FileContent = {
  content: string
  success: boolean
}

export async function handler({ question, input }: ScrapperData): Promise<unknown> {
  const { content, success } = await getFileContent(input)
  if (!success) {
    throw new Error(content)
  }

  const humanMessage = `Question: ${question}`
  const systemMessage = `
    Return answer for the question in POLISH language, based on provided context.
    Maximum length for the answer is 200 characters.
    ###Context:\n${content}
  `

  return langchainService.invoke(systemMessage, humanMessage)
}

async function getFileContent(url: string, attempt: number = 0): Promise<FileContent> {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': userAgent } })
    return { content: data, success: true }
  } catch (error: unknown) {
    const { message } = error as AxiosError
    return attempt > MAX_ATTEMPTS
      ? { content: `Error durring file fetching: ${message}. Run again!`, success: false }
      : getFileContent(url, ++attempt)
  }
}
