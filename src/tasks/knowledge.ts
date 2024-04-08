import * as langchainService from '../services/langchain'
import { FunctionCall, FunctionCallResponse } from '../types/local'
import { TaskResponse } from '../types/remote'
import axios from 'axios'

type KnowledgeData = { question: string } & TaskResponse

export async function handler({ question }: KnowledgeData): Promise<string | number> {
  const { name = '', args = {} } = await getFunctionToRun(question) || {}
  const resolverFn = {
    'getExchangeRate': getExchangeRate,
    'getPupulation': getPupulation,
    'getBasicKnowledge': getBasicKnowledge,
  }[name]

  if (!resolverFn) {
    throw new Error('Not found resolver. Try again!')
  }

  return resolverFn(args)
}

async function getFunctionToRun(userMessage: string): Promise<FunctionCallResponse> {
  const systemMessage = 'Decide which function use based on user message. You have to prepare data for function.'
  return langchainService.invokeWithFunctionCalling(systemMessage, userMessage, getFunctions())
}

async function getBasicKnowledge({ question }: Record<string, unknown>): Promise<string> {
  const systemMessage = 'Answer the question very clearly and concise. Retrun only answer without additional content.'
  return langchainService.invoke(systemMessage, question as string)
}

async function getPupulation({ country }: Record<string, unknown>): Promise<number> {
  const { data } = await axios(`https://restcountries.com/v3.1/name/${country}?fields=population`)
  const [{ population }] = data
  return population
}

async function getExchangeRate({ currency }: Record<string, unknown>): Promise<number> {
  const { data } = await axios(`http://api.nbp.pl/api/exchangerates/rates/A/${currency}/last/1/`)
  const [{ mid }] = data.rates
  return mid
}

function getFunctions(): FunctionCall[] {
  return [
    {
      name: 'getExchangeRate',
      description: 'Get exchange rate from API',
      parameters: {
        type: 'object',
        properties: {
          currency: { type: 'string', description: 'Currency in XXX format' },
        },
        required: ['currency'],
      }
    },
    {
      name: 'getPupulation',
      description: 'Get country poplation from API',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Country to fetch population' },
        },
        required: ['country'],
      }
    },
    {
      name: 'getBasicKnowledge',
      description: 'Get exchange rate from API',
      parameters: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'Question to basic knowledge' },
        },
        required: ['question'],
      }
    },
  ]
}
