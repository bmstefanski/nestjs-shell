import { ShellRegistry } from './shell.registry'
import { BootstrapOptions } from './type/bootstrap-options.type'

const readline = require('readline')

export async function bootstrapShell(options: BootstrapOptions = { prompt: '⤳' }): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${options.prompt} `,
  })

  const messages = {
    notFound: `Say what? I might have heard $input`,
    wrongUsage: `Wrong usage: $command $pattern`,
    ...options.messages,
  }

  const onLine = async (line) => {
    const splittedLineResult = line.trim().split(' ')

    const command = ShellRegistry.findCommand(splittedLineResult[0])

    if (!command) {
      console.log(messages.notFound.replace('$input', line))
      return
    }

    return command.handler(splittedLineResult.slice(1), { wrongUsage: messages.wrongUsage })
  }

  rl.on('line', async (input) => onLine(input).then(() => rl.prompt())).on('close', () => process.exit())
}
