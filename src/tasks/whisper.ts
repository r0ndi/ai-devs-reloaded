import * as path from 'path'
import * as openaiService from '../services/openai'

export async function handler(): Promise<string> {
  const filePath = path.join(__dirname, '../../resources/whisper-task.mp3')
  return openaiService.getTranscription(filePath)
}
