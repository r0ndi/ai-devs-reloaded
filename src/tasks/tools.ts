import * as langchainService from '../services/langchain'
import { FunctionCall, Model } from '../types/local'
import { getCurrentDate } from '../helpers/utils'
import { TaskResponse } from '../types/remote'

type ToolsData = { question: string } & TaskResponse

export async function handler({ question }: ToolsData): Promise<Record<string, unknown>> {
  const systemMessage = `
    Decide which function use based on user message. You have to prepare data for function.
    ### Context: Current date: ${getCurrentDate()}
  `
  const response = await langchainService.invokeWithFunctionCalling(
    systemMessage, question, [functionSchema], Model.GPT_4_TURBO_PREVIEW,
  )

  if (!response) {
    throw new Error('Response not found. Try again!')
  }

  return response.args
}

const functionSchema: FunctionCall = {
  name: 'describeIntention',
  description: 'Describe user intention based on his message',
  parameters: {
    type: 'object',
    properties: {
      tool: {
        type: 'string',
        enum: ['ToDo', 'Calendar'],
        description: 'Tool that will be selected based on the message. ToDo - action to do. Calendar - event and reminders'
      },
      desc: { type: 'string', description: 'Action description for the tool' },
      date: { type: 'string', description: 'Date for only calendar tool in YYYY-MM-DD format' },
    },
    required: ['tool', 'desc'],
  },
}
