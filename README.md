# AI Devs 2 Reloaded
Unofficial CLI for AI Devs

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
2. In the new file add resolver function like `export function helloapi(dataFromTask) { return answer }`
3. Implement the body of the function
4. Run the task using `npm start -- taskName`, e.g. `npm start -- helloapi`

## Author
Konrad Sądel @ 2024