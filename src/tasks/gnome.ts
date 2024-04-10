import { TaskResponse } from '../types/remote'
import * as openaiService from '../services/openai'

type GnomeData = { url: string } & TaskResponse

export async function handler({ url }: GnomeData): Promise<any> {
  const userMessage = 'What color is the gnome\'s hat? The answer should be short, concise and in Polish.'
    + 'If there is something other than a gnome in the image, return: error'
  return openaiService.invokeImageDetector(userMessage, url)
}
