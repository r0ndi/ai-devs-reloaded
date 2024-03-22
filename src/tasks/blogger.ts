import OpenAI from 'openai'
import { TaskResponse } from '../types/remote'

type BloggerData = TaskResponse & {
  blog: string[]
}

type Completions = {
  choices: { message: { content: string } }[]
}

export async function blogger({ blog }: BloggerData): Promise<string[]> {
  return Promise.all(blog.map(createCompletions))
}

async function createCompletions(content: string): Promise<string> {
  const systemContext =
    `#Role: Food blogger.
     #Instraction: Return only a few sentences (max 4) on a given topic. Return information on history, recipes,
     creation process and tips. Answer must be expressed in the same language as the question`

  const openai = new OpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemContext },
      { role: 'user', content },
    ],
  }) as Completions
  
  return completion.choices[0].message.content
}
