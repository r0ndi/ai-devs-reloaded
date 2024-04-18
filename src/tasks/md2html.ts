import * as openaiService from '../services/openai'
import { TaskResponse } from '../types/remote'

type Md2HtmlResponse = { input: string } & TaskResponse

export async function handler({ input }: Md2HtmlResponse): Promise<string> {
  const model = process.env.OPENAI_FINE_TUNING_MODEL || ''
  return openaiService.sendCompletionsWithFineTuning('Parse MD to HTML', input, model)
}
