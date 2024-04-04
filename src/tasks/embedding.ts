import * as openaiService from '../services/openai'
import { Model } from '../types/local'

export async function handler(): Promise<number[]> {
  const sentence = 'Hawaiian pizza'
  return openaiService.getEmbeddings(sentence, Model.TEXT_EMBEDDING_ADA_002)
}
