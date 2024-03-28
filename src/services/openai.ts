import fs from 'fs'
import OpenAI from 'openai'
import { Moderation } from 'openai/resources'

export async function sendCompletions(
  systemContent: string, userContent: string, model: string = 'gpt-3.5-turbo',
): Promise<string> {
  const completion = await (new OpenAI()).chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ],
  })
  return (completion.choices[0].message.content || '').trim()
}

export async function moderateInputs(input: string[]): Promise<Moderation[]> {
  const { results } = await (new OpenAI()).moderations.create({ input })
  return results
}

export async function getEmbeddings(input: string, model: string = 'text-embedding-3-small'): Promise<number[]> {
  const embedding = await (new OpenAI()).embeddings.create({ input, model })
  return embedding.data[0].embedding || []
}

export async function getTranscription(filePath: string, model: string = 'whisper-1'): Promise<string> {
  const { text } = await (new OpenAI()).audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model,
  })
  return text
}
