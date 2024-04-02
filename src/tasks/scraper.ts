import * as langchainService from '../services/langchain'
import { TaskResponse } from '../types/remote'
import axios, { AxiosError } from 'axios'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
const MAX_ATTEMPTS = 5

type ScraperData = TaskResponse & {
  question: string
  input: string
}

type FileContent = {
  content: string
  success: boolean
}

export async function handler({ question, input: fileUrl }: ScraperData): Promise<string> {
  const context = await getFileContent(fileUrl)
  const humanMessage = `Question: ${question}`
  const systemMessage = `
    Return answer for the question in POLISH language, based on provided context.
    Maximum length for the answer is 200 characters.
    ###Context:\n${context}
  `

  return langchainService.invoke(systemMessage, humanMessage)
}

async function getFileContent(url: string, attempt: number = 0): Promise<string> {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': USER_AGENT } })
    return data
  } catch (error: unknown) {
    if (attempt <= MAX_ATTEMPTS) {
      return getFileContent(url, ++attempt)
    }

    const { message } = error as AxiosError
    throw new Error(`Error during file fetching: ${message}. Run again!`)
  }
}
