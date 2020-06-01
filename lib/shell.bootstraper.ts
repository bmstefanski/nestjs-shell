import { ShellCommandsRegistry } from './shell-commands.registry'
import { BootstrapOptions } from './type/bootstrap-options.type'

const readline = require('readline')

export async function bootstrapShell(options: BootstrapOptions = { prompt: '>' }): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${options.prompt} `,
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
