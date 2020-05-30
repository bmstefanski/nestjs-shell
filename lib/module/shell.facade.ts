import { Injectable } from '@nestjs/common'
import { Command } from './command.type'
import { BootstrapOptions, RegisterComponentOptions } from './options.type'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { bootstrapShell } from './shell.bootstraper'

@Injectable()
export class ShellFacade {
  public async bootstrap(options: BootstrapOptions): Promise<void> {
    await bootstrapShell(options)
  }

  public registerComponents(...components: RegisterComponentOptions[]): void {
    components.forEach((component) => {
      ShellCommandsRegistry.registerComponent({ componentFile: component.componentFile, args: component.args })
    })
  }

  public registerCommands(...commands: Command[]): void {
    commands.forEach((command) => {
      ShellCommandsRegistry.registerCommand(command)
    })
  }
}
