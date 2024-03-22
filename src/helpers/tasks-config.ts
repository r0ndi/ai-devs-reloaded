import * as fs from 'fs'
import * as path from 'path'
import { TasksConfig } from '../types/local'

export async function getTasksConfig(): Promise<TasksConfig> {
  const tasksDir = path.join(__dirname, '../tasks')
  const tasksConfig: TasksConfig = {}

  const includedFiles = fs.readdirSync(tasksDir).filter(file => file.match(/(\.ts$)/))
  for (const file of includedFiles) {
    const taskName = file.split('.')[0]
    const taskModule = require(path.join(tasksDir, file))
    if (taskModule && taskModule[taskName]) {
      tasksConfig[taskName] = taskModule[taskName]
    }
  }

  return tasksConfig
}
