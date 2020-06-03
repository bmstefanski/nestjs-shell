export type Command = { name: string; prefix?: string; description?: string; pattern?: string; handler: InputHandler }
type InputHandler = (input: string[], messages: { wrongUsage: string }, print: (value: any) => void) => Promise<any>
