import { ShellCommandsRegistry } from './shell-commands.registry'

const readline = require('readline')

export class ShellBootstraper {
  public async bootstrap(options: { prompt?: string } = {}): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${options.prompt || '>'} `,
    })

    rl.prompt()

    const onLine = async (line) => {
      const splittedLineResult = line.trim().split(' ')

      const command = ShellCommandsRegistry.findCommand(splittedLineResult[0])

      if (!command) {
        console.log(`Say what? I might have heard '${line.trim()}'`)
        return
      }

      command.handler(line)
    }

    rl.on('line', async (input) => {
      await onLine(input)
      rl.prompt()
    }).on('close', () => process.exit())
  }
}
