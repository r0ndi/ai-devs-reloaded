import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { Model } from '../types/local'

export async function invoke(
  systemMessage: string, humanMessage: string, options?: ChatOpenAICallOptions, model: Model = Model.GPT_3_5_TURBO,
): Promise<string> {
  const openAi = new ChatOpenAI({ modelName: model })
  const response = await openAi.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(humanMessage),
  ], options)
  return response.content as string
}
