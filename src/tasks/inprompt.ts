import * as langchainService from '../services/langchain'
import { TaskResponse } from '../types/remote'

type InpromptData = TaskResponse & {
  question: string
  input: string[]
}

type Document = {
  name: string
  content: string
}

export async function handler({ input, question }: InpromptData): Promise<string> {
  const documents = prepareDocuments(input)
  const humanMessage = `Query: ${question}`
  const systemMessage = `
    Select one of the following names associated with user query and answer for question.
    Names###\n${parseDocuments(documents)}
  `

  return langchainService.invoke(systemMessage, humanMessage)
}

function parseDocuments(documents: Document[]): string {
  return documents.map(({ name, content }: Document) => `${name}: ${content}`).join('\n')
}

function prepareDocuments(contents: string[]): Document[] {
  return contents.map((content: string): Document => {
    const name = (content.match(/^\S+/) || [])[0] || ''
    return { name, content }
  })
}
