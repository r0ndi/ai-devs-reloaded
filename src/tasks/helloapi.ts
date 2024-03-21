import { TaskResponse } from '../types/remote'

type HelloApiData = TaskResponse & {
  cookie: string
}

export async function helloapi({ cookie }: HelloApiData): Promise<string> {
  return cookie
}
