import * as openaiService from '../services/openai'
import { TaskResponse } from '../types/remote'

type BloggerData = TaskResponse & {
  blog: string[]
}

export async function blogger({ blog }: BloggerData): Promise<string[]> {
  return Promise.all(blog.map(createCompletions))
}

async function createCompletions(content: string): Promise<string> {
  const systemContext = '#Role: Food blogger.\n'
    + '#Instraction: Return only a few sentences (max 4) on a given topic. Return information on history, recipes, '
    + 'creation process and tips. Answer must be expressed in the same language as the question'
  return openaiService.sendCompletions(systemContext, content)
}
