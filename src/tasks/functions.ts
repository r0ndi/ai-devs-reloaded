type FunctionCall = {
  name: string
  description: string
  parameters: {
    type: string
    required: string[]
    properties: Record<string, { type: string, description: string }>
  }
}

export async function handler(): Promise<FunctionCall> {
  return {
    name: 'addUser',
    description: 'Classify user to add',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'User first name'
        },
        surname: {
          type: 'string',
          description: 'User surname name'
        },
        year: {
          type: 'integer',
          description: 'Year of birth'
        },
      },
      required: [
        'name', 'surname', 'year'
      ]
    }
  }
}
