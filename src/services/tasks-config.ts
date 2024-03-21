import { blogger } from '../tasks/blogger'
import { helloapi } from '../tasks/helloapi'
import { moderation } from '../tasks/moderation'
import { TasksConfig } from '../types/local'

export const tasksConfig: TasksConfig = {
  'helloapi': helloapi,
  'moderation': moderation,
  'blogger': blogger,
}
