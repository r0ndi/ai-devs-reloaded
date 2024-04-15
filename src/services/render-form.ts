import { RenderFormResponse } from '../types/remote'
import axios from 'axios'

export async function generateImage(data: Record<string, string>): Promise<RenderFormResponse> {
  const response = await axios.post(
    process.env.RENDER_FORM_API_URL || '',
    getTemplateData(data),
    { headers: getHeaders() },
  )
  return response.status === 200
    ? { success: true, ...response.data }
    : { success: false }
}

function getTemplateData(data: Record<string, string>): Record<string, string | Record<string, string>> {
  const templateId = process.env.RENDER_FORM_TEMPLATE_ID || ''
  return {
    template: templateId,
    data,
  }
}

function getHeaders(): Record<string, string> {
  return {
    'X-API-KEY': process.env.RENDER_FORM_API_KEY || '',
    'Content-Type': 'application/json',
  }
}
