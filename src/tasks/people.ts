import * as langchainService from '../services/langchain'
import * as qdrantService from '../services/qdrant'
import { TaskResponse } from '../types/remote'
import { QdrantItem } from '../types/local'
import { v4 } from 'uuid'
import * as R from 'ramda'
import { delay } from '../helpers/utils'

type PeopleData = TaskResponse & { question: string }

type People = {
  imie: string
  nazwisko: string
  wiek: number
  o_mnie: string
  ulubiona_postac_z_kapitana_bomby: string
  ulubiony_serial: string
  ulubiony_film: string
  ulubiony_kolor: string
}

type SearchItem = {
  payload: { content: string }
}

const BATCH_SIZE = 100
const BATCH_DELAY = 1_000
const COLLECTION_NAME = 'people'
const PEOPLE_DATA_URL = 'https://tasks.aidevs.pl/data/people.json'

export async function handler({ question }: PeopleData): Promise<string> {
  const client = qdrantService.createClient()

  if (!await qdrantService.isCollectionExists(client, COLLECTION_NAME)) {
    await qdrantService.createCollection(client, COLLECTION_NAME, true)
  }

  if (await qdrantService.isEmptyCollection(client, COLLECTION_NAME)) {
    for (const people of R.splitEvery(BATCH_SIZE, await getPeople())) {
      const items = await prepareQdrantItems(people)
      await qdrantService.upsertItems(client, COLLECTION_NAME, items)
      await delay(BATCH_DELAY)
    }
  }

  const queryEmbedding = await langchainService.getEmbedding(question)
  const response = await qdrantService.searchItem<SearchItem>(client, COLLECTION_NAME, queryEmbedding)
  const systemMessage = `
    ### Instructions:
    You have to answer the given question based on the context provided.
    The answer should be short, without additional information.
    ### Context:\n${response.payload.content}
  `
  return langchainService.invoke(systemMessage, question)
}

async function prepareQdrantItems(people: People[]): Promise<QdrantItem[]> {
  const generateContent = (people: People): string => {
    return [
      `Imie: ${people.imie}`,
      `Nazwisko: ${people.nazwisko}`,
      `Wiek: ${people.wiek}`,
      `O mnie: ${people.o_mnie}`,
      `Ulubiona postac z kapitana bomby: ${people.ulubiona_postac_z_kapitana_bomby}`,
      `Ulubiony serial: ${people.ulubiony_serial}`,
      `Ulubiony film: ${people.ulubiony_film}`,
      `Ulubiony kolor: ${people.ulubiony_kolor}`,
    ].join(', ')
  }

  const prepareItem = async (people: People): Promise<QdrantItem> => ({
    vector: await langchainService.getEmbedding(generateContent(people)),
    payload: { content: generateContent(people) },
    id: v4(),
  })

  return Promise.all(people.map(prepareItem))
}

async function getPeople(): Promise<People[]> {
  const response = await fetch(PEOPLE_DATA_URL)
  return response.json()
}
