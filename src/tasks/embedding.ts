import * as openaiService from '../services/openai'

export async function handler(): Promise<number[]> {
  const sentence = 'Hawaiian pizza'
  return openaiService.getEmbeddings(sentence, 'text-embedding-ada-002')
}
