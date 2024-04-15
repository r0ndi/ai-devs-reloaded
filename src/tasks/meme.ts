import * as renderFromService from '../services/render-form'
import { TaskResponse } from '../types/remote'

type MemeData = TaskResponse & { image: string, text: string }

export async function handler({ image, text }: MemeData): Promise<string> {
  const { success, href } = await renderFromService.generateImage({ 'text.text': text, 'image.src': image })
  if (!success || !href) {
    throw new Error('Error occurred during image generation. Try again!')
  }
  return href
}
