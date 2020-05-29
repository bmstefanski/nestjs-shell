import { ShellCommandsRegistry } from './shell-commands.registry'

const readline = require('readline')

export class ShellBootstraper {
  public async bootstrap(options: { prompt?: string } = {}): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${options.prompt || '>'} `,
    })

    const onLine = async (line) => {
      const splittedLineResult = line.trim().split(' ')

      const command = ShellCommandsRegistry.findCommand(splittedLineResult[0])

      if (!command) {
        console.log(`Say what? I might have heard '${line.trim()}'`)
        return
      }

      return command.handler(splittedLineResult.slice(1))
    }

    rl.on('line', async (input) => onLine(input).then(() => rl.prompt())).on('close', () => process.exit())
  }
}
