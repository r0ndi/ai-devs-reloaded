import OpenAI from 'openai'
import { ChatCompletion, Moderation } from 'openai/resources'

export async function sendCompletions(
  systemContent: string, userContent: string, model: string = 'gpt-3.5-turbo',
): Promise<string> {
  const completion = await (new OpenAI()).chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ],
  }) as ChatCompletion
  return (completion.choices[0].message.content || '').trim()
}

export async function moderateInputs(input: string[]): Promise<Moderation[]> {
  const { results } = await (new OpenAI()).moderations.create({ input })
  return results
}