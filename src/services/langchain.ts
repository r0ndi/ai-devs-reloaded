import { ChatOpenAI, ChatOpenAICallOptions, OpenAIEmbeddings } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { FunctionCall, FunctionCallResponse, Model } from '../types/local'
import { parseFunctionCall } from '../helpers/utils'

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

export async function invokeWithFunctionCalling(
  systemMessage: string,
  humanMessage: string,
  functions: FunctionCall[],
  model: Model = Model.GPT_3_5_TURBO,
): Promise<FunctionCallResponse> {
  const openAi = new ChatOpenAI({ modelName: model }).bind({ functions: functions })
  const response = await openAi.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(humanMessage),
  ])
  return parseFunctionCall(response)
}

export async function getEmbedding(text: string, model: Model = Model.TEXT_EMBEDDING_ADA_002): Promise<number[]> {
  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5, modelName: model })
  return embeddings.embedQuery(text)
}
