import OpenAI from 'openai'
import { TaskResponse } from '../types/remote'

type ModerationData = TaskResponse & {
  input: string[]
}

export async function moderation({ input = [] }: ModerationData): Promise<number[]> {
  const openai = new OpenAI()
  const { results } = await openai.moderations.create({ input })
  return results.map(({ flagged }: { flagged: boolean }) => flagged ? 1 : 0)
}
