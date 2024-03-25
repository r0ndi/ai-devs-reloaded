import { TaskResponse } from '../types/remote'

type HelloApiData = TaskResponse & {
  cookie: string
}

export async function handler({ cookie }: HelloApiData): Promise<string> {
  return cookie
}
