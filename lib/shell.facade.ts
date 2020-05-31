import { Injectable } from '@nestjs/common'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { bootstrapShell } from './shell.bootstraper'
import { Command } from './type/command.type'
import { BootstrapOptions, RegisterComponentOptions } from './type/options.type'

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
