import { Injectable } from '@nestjs/common'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'
import { bootstrapShell } from './shell.bootstraper'
import { Command } from './type/command.type'
import { BootstrapOptions } from './type/options.type'

@Injectable()
export class ShellFacade {
  public async bootstrap(options: BootstrapOptions): Promise<void> {
    await bootstrapShell(options)
  }

  public registerComponents(...components: ShellComponent[]): void {
    components.forEach((component) => ShellCommandsRegistry.registerComponent(component))
  }

  public registerCommands(...commands: Command[]): void {
    commands.forEach((command) => {
      ShellCommandsRegistry.registerCommand(command)
    })
  }
}
