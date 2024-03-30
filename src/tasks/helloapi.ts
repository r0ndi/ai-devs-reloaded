import { TaskResponse } from '../types/remote'

type HelloApiData = TaskResponse & {
  cookie: string
}

export function handler({ cookie }: HelloApiData): string {
  return cookie
}
