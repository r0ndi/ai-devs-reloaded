import * as langchainService from '../services/langchain'
import { TaskResponse } from '../types/remote'

type OptimalDBData = TaskResponse & { database: string }
type DatabaseContent = { [key: string]: string[] }

export async function handler({ database }: OptimalDBData): Promise<string> {
  const dbContent = await getDatabase(database)
  const response: string[] = await Promise.all(
    Object.entries(dbContent).map(([user, content]) => compressUserData(user, content))
  )
  return response.join(' ')
}

async function compressUserData(user: string, data: string[]): Promise<string> {
  const systemMessage = `
    Compress user-supplied JSON. Return very short text with only important and key information like as movie, job, hobbies, inspirations. Use english language.
    ### Example: programmer, matrix
  `
  const response = await langchainService.invoke(systemMessage, JSON.stringify(data))
  return `${user}: ${response}`
}

async function getDatabase(databaseUrl: string): Promise<DatabaseContent> {
  const response = await fetch(databaseUrl)
  return response.json()
}
