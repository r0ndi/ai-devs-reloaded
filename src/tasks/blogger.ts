import OpenAI from 'openai'
import { TaskResponse } from '../types/remote'

type BloggerData = TaskResponse & {
  blog: string[]
}

export async function blogger({ blog }: BloggerData): Promise<string[]> {
  const systemContext =
    `#Role: Food blogger.
     #Instraction: Return only a few sentences (max 4) on a given topic. Return information on history, recipes,
     creation process and tips. Answer must be expressed in the same language as the question`

  const openai = new OpenAI()
  const response: string[] = []

  for (const sentence of blog) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: sentence },
      ],
    })
    response.push(completion.choices[0].message.content as string)
  }

  return response
}
