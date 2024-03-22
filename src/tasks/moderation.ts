import * as openaiService from '../services/openai'
import { TaskResponse } from '../types/remote'
import { Moderation } from 'openai/resources'

type ModerationData = TaskResponse & {
  input: string[]
}

export async function moderation({ input = [] }: ModerationData): Promise<number[]> {
  const results = await openaiService.moderateInputs(input)
  return results.map(({ flagged }: Moderation) => flagged ? 1 : 0)
}
