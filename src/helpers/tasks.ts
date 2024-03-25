import * as fs from 'fs'
import * as path from 'path'
import { TaskResolver } from '../types/local'

export async function getTaskResolver(taskName: string): Promise<TaskResolver | undefined> {
  const taskPath = path.join(__dirname, '../tasks', `${taskName}.ts`)
  if (!fs.existsSync(taskPath)) {
    return
  }

  const { handler } = require(taskPath)
  return handler
}

export function getTaskName(): string {
  const taskName = process.argv[2]
  if (!taskName) {
    throw new Error('Missing task name')
  }

  return taskName
}
