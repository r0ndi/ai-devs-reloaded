import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export async function invoke(systemMessage: string, humanMessage: string): Promise<string> {
  const openAi = new ChatOpenAI()
  const response = await openAi.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(humanMessage),
  ])
  return response.content as string
}
