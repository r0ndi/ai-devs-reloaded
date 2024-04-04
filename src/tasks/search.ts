import * as langchainService from '../services/langchain'
import * as qdrantService from '../services/qdrant'
import { TaskResponse } from '../types/remote'
import { QdrantItem } from '../types/local'
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

const COLLECTION_NAME = 'news'
const NEWS_URL = 'https://unknow.news/archiwum_aidevs.json'

export async function handler({ question }: SearchData): Promise<string> {
  const client = qdrantService.createClient()

  if (!await qdrantService.isCollectionExists(client, COLLECTION_NAME)) {
    await qdrantService.createCollection(client, COLLECTION_NAME, true)
  }

  if (await qdrantService.isEmptyCollection(client, COLLECTION_NAME)) {
    const news = await getNews()
    const items = await prepareQdrantItems(news)
    await qdrantService.upsertItems(client, COLLECTION_NAME, items)
  }

  const queryEmbedding = await langchainService.getEmbedding(question)
  const response = await qdrantService.searchItem<SearchItem>(client, COLLECTION_NAME, queryEmbedding)
  return response.payload.url || ''
}

async function prepareQdrantItems(news: News[]): Promise<QdrantItem[]> {
  const prepareItem = async ({ info, url, title }: News): Promise<QdrantItem> => ({
    vector: await langchainService.getEmbedding(`Title: ${title}, ${info}`),
    payload: { content: info, title, url },
    id: v4(),
  })

  return Promise.all(news.map(prepareItem))
}

async function getNews(): Promise<News[]> {
  const response = await fetch(NEWS_URL)
  return response.json()
}
