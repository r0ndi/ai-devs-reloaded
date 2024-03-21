export type TasksConfig = {
  [key: string]: (data: any) => Promise<unknown>
}
