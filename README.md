# AI Devs 2 Reloaded
Unofficial CLI for AI Devs

## Requirements
1. Ai devs account [aidevs.pl](https://www.aidevs.pl/)
1. Openai account [openai.com](https://platform.openai.com/)
1. Vector db [qdrant.tech](https://qdrant.tech/documentation/quick-start/)
1. API gateway [ngrok.com](https://ngrok.com/docs/getting-started/)
1. RenderForm account [renderform.io](https://renderform.io/)
1. Serpapi account [serpapi.com](https://serpapi.com/)
1. Common sense

## Configuration and usage
1. Install the dependencies
    ```shell
    npm ci
    ```

2. Copy and configure environment variables
    ```shell
    cp .env.example .env
    ```

3. Start and execute task
    ```shell
    npm start -- taskName
    ```

## Adding a new task
1. Add a new `.ts` file to the `src/tasks` directory matching the task name, e.g. `helloapi.ts`.
1. In the new file add resolver function with name "handler" like `export function handler(data: TaskResponse): Promise<unknown> {}` witch return task answer. Look for an [example](https://github.com/r0ndi/ai-devs-reloaded/blob/main/src/tasks/helloapi.ts).
1. Implement the body of the function
1. Run the task using `npm start -- taskName`, e.g. `npm start -- helloapi`

## Author
Konrad Sądel @ 2024