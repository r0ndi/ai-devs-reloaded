import * as langchainService from '../services/langchain'
import * as qdrantService from '../services/qdrant'
import { TaskResponse } from '../types/remote'
import { Document } from 'langchain/document'
import { QdrantItem } from '../types/local'
import axios, { AxiosError } from 'axios'
import { v4 } from 'uuid'

type SearchData = TaskResponse & {
  question: string
}

type News = {
  title: string
  url: string
  info: string
  date: string
}

type SearchItem = {
  payload: { url: string }
}

const NEWS_URL = 'https://unknow.news/archiwum_aidevs.json'
const COLLECTION_NAME = 'news'

export async function handler({ question }: SearchData): Promise<string> {
  const client = qdrantService.createClient()

  if (!await qdrantService.isCollectionExists(client, COLLECTION_NAME)) {
    await qdrantService.createCollection(client, COLLECTION_NAME, true)
  }

  if (await qdrantService.isEmptyCollection(client, COLLECTION_NAME)) {
    const news = await getNews()
    const documents = await prepareQdrantItems(news)
    await qdrantService.upsertItems(client, COLLECTION_NAME, documents)
  }

  const queryEmbedding = await langchainService.getEmbedding(question)
  const response = await qdrantService.searchItem<SearchItem>(client, COLLECTION_NAME, queryEmbedding)
  return response.payload.url || ''
}

async function prepareQdrantItems(news: News[]): Promise<QdrantItem[]> {
  const prepareItem = async ({ info, url, title }: News): Promise<QdrantItem> => {
    const pageContent = `Title: ${title}, ${info}`
    const document = new Document({ pageContent })
    return {
      id: v4(),
      payload: { ...document.metadata, content: info, title, url },
      vector: await langchainService.getEmbedding(document.pageContent),
    }
  }
  return Promise.all(news.map(prepareItem))
}

async function getNews(): Promise<News[]> {
  try {
    const { data } = await axios.get(NEWS_URL)
    return data as News[]
  } catch (error: unknown) {
    const { message } = error as AxiosError
    throw new Error(`Error during file fetching: ${message}. Run again!`)
  }
}
