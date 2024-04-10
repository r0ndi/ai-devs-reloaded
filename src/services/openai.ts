import fs from 'fs'
import OpenAI from 'openai'
import { Moderation } from 'openai/resources'
import { Model } from '../types/local'

export async function sendCompletions(
  systemContent: string, userContent: string, model: string = Model.GPT_3_5_TURBO,
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

export async function getEmbeddings(input: string, model: string = Model.TEXT_EMBEDDING_3_SMALL): Promise<number[]> {
  const embedding = await (new OpenAI()).embeddings.create({ input, model })
  return embedding.data[0].embedding || []
}

export async function getTranscription(filePath: string, model: string = Model.WHISPER_1): Promise<string> {
  const { text } = await (new OpenAI()).audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model,
  })
  return text
}

export async function invokeImageDetector(
  humanMessage: string, url: string, model: Model = Model.GPT_4_TURBO,
): Promise<string> {
  const completion = await (new OpenAI()).chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: humanMessage },
          { type: 'image_url', image_url: { url } },
        ]
      },
    ],
  })
  return (completion.choices[0].message.content || '').trim()
}
